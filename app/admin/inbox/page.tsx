'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Send,
  RefreshCw,
  User,
  Loader2,
  Inbox,
  Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Email = {
  id: string;
  message_id: string;
  from_email: string;
  from_name: string | null;
  to_email: string;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  direction: 'inbound' | 'outbound';
  is_read: boolean;
  feedback_id: string | null;
  created_at: string;
};

type Conversation = {
  email: string;
  name: string | null;
  lastMessage: string;
  lastDate: string;
  unreadCount: number;
  messages: Email[];
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function InboxPage() {
  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    data: emails = [],
    isLoading,
    refetch,
  } = useQuery<Email[]>({
    queryKey: ['inbox-emails'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('email_threads')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as Email[];
    },
  });

  // Group emails into conversations by email address
  const conversations: Conversation[] = (() => {
    const grouped = new Map<string, Email[]>();

    emails.forEach((email) => {
      const key = email.direction === 'inbound' ? email.from_email : email.to_email;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(email);
    });

    return Array.from(grouped.entries())
      .map(([email, messages]) => {
        const sortedMessages = messages.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        const lastMessage = sortedMessages[sortedMessages.length - 1];
        const inboundMessages = messages.filter((m) => m.direction === 'inbound');
        const name = inboundMessages.find((m) => m.from_name)?.from_name || null;
        const unreadCount = messages.filter((m) => !m.is_read && m.direction === 'inbound').length;

        return {
          email,
          name,
          lastMessage: lastMessage.body_text || lastMessage.subject || '',
          lastDate: lastMessage.created_at,
          unreadCount,
          messages: sortedMessages,
        };
      })
      .sort((a, b) => new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime());
  })();

  const currentConversation = conversations.find((c) => c.email === selectedConversation);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  // Mark messages as read when conversation is selected
  const markAsRead = useMutation({
    mutationFn: async (emailIds: string[]) => {
      const { error } = await (supabase as any)
        .from('email_threads')
        .update({ is_read: true })
        .in('id', emailIds);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox-emails'] });
    },
  });

  useEffect(() => {
    if (currentConversation) {
      const unreadIds = currentConversation.messages
        .filter((m) => !m.is_read && m.direction === 'inbound')
        .map((m) => m.id);
      if (unreadIds.length > 0) {
        markAsRead.mutate(unreadIds);
      }
    }
  }, [selectedConversation]);

  // Send reply
  const sendReply = useMutation({
    mutationFn: async () => {
      if (!currentConversation) throw new Error('No conversation selected');

      const lastInbound = [...currentConversation.messages]
        .reverse()
        .find((m) => m.direction === 'inbound');

      const response = await fetch('/api/feedback/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbackId: lastInbound?.feedback_id || 'direct-email',
          to: currentConversation.email,
          subject: `Re: ${lastInbound?.subject || 'Your message'}`,
          message: replyMessage,
          userName: currentConversation.name || currentConversation.email,
          originalMessage: '',
          feedbackType: 'email',
          inReplyTo: lastInbound?.message_id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send reply');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Message sent' });
      setReplyMessage('');
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Failed to send',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (replyMessage.trim()) {
        sendReply.mutate();
      }
    }
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="flex h-[calc(100vh-12rem)] overflow-hidden rounded-lg border bg-white dark:bg-gray-900">
      {/* Conversations List */}
      <div className="w-80 flex-shrink-0 border-r">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Inbox className="h-5 w-5" />
            <span className="font-semibold">Inbox</span>
            {totalUnread > 0 && (
              <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                {totalUnread}
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100%-4rem)]">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No conversations</div>
          ) : (
            <div className="divide-y">
              {conversations.map((conv) => (
                <button
                  key={conv.email}
                  onClick={() => setSelectedConversation(conv.email)}
                  className={cn(
                    'w-full p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800',
                    selectedConversation === conv.email && 'bg-gray-100 dark:bg-gray-800',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          'truncate text-sm',
                          conv.unreadCount > 0 && 'font-semibold'
                        )}>
                          {conv.name || conv.email.split('@')[0]}
                        </span>
                        <span className="ml-2 flex-shrink-0 text-xs text-muted-foreground">
                          {formatTime(conv.lastDate)}
                        </span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {conv.email}
                      </p>
                      <p className={cn(
                        'mt-1 truncate text-sm text-muted-foreground',
                        conv.unreadCount > 0 && 'font-medium text-foreground'
                      )}>
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <Circle className="h-2.5 w-2.5 flex-shrink-0 fill-blue-500 text-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {currentConversation.name || currentConversation.email.split('@')[0]}
                </p>
                <p className="text-sm text-muted-foreground">{currentConversation.email}</p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex',
                      message.direction === 'outbound' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[70%] rounded-2xl px-4 py-2',
                        message.direction === 'outbound'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-gray-100 dark:bg-gray-800'
                      )}
                    >
                      {message.subject && (
                        <p className={cn(
                          'mb-1 text-xs font-medium',
                          message.direction === 'outbound'
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        )}>
                          {message.subject}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap text-sm">{message.body_text}</p>
                      <p
                        className={cn(
                          'mt-1 text-right text-xs',
                          message.direction === 'outbound'
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        )}
                      >
                        {formatMessageTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Reply Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
                  className="min-h-[80px] resize-none"
                />
                <Button
                  onClick={() => sendReply.mutate()}
                  disabled={sendReply.isPending || !replyMessage.trim()}
                  className="h-auto"
                >
                  {sendReply.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
            <Inbox className="mb-4 h-16 w-16" />
            <p className="text-lg">Select a conversation</p>
            <p className="text-sm">Choose a conversation from the left to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
