'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { ChatBox, ChatMessage } from '@/components/chat-box';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RefreshCw,
  User,
  MessageSquare,
  Bug,
  Lightbulb,
  HelpCircle,
  Circle,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Feedback = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  feedback_type: string;
  message: string;
  replied_at?: string | null;
};

type EmailThread = {
  id: string;
  message_id: string;
  from_email: string;
  from_name: string | null;
  to_email: string;
  subject: string | null;
  body_text: string | null;
  direction: 'inbound' | 'outbound';
  is_read: boolean;
  feedback_id: string | null;
  created_at: string;
};

type Conversation = {
  feedback: Feedback;
  emails: EmailThread[];
  lastActivity: string;
  hasUnreplied: boolean;
};

const feedbackTypeConfig: Record<
  string,
  { icon: React.ElementType; color: string; label: string }
> = {
  general: {
    icon: MessageSquare,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    label: 'General',
  },
  bug: {
    icon: Bug,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    label: 'Bug',
  },
  feature: {
    icon: Lightbulb,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    label: 'Feature',
  },
  other: {
    icon: HelpCircle,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    label: 'Other',
  },
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

export default function FeedbackPage() {
  const supabase = useSupabaseBrowser();
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch feedback
  const { data: feedbackList = [], isLoading: loadingFeedback, refetch: refetchFeedback } = useQuery<Feedback[]>({
    queryKey: ['feedback', typeFilter],
    queryFn: async () => {
      let query = supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (typeFilter !== 'all') {
        query = query.eq('feedback_type', typeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Feedback[];
    },
  });

  // Fetch email threads for feedback
  const { data: emailThreads = [], refetch: refetchEmails } = useQuery<EmailThread[]>({
    queryKey: ['feedback-emails'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('email_threads')
        .select('*')
        .not('feedback_id', 'is', null)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as EmailThread[];
    },
  });

  const refetch = () => {
    refetchFeedback();
    refetchEmails();
  };

  // Build conversations
  const conversations: Conversation[] = feedbackList
    .filter((feedback) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        feedback.name?.toLowerCase().includes(query) ||
        feedback.email?.toLowerCase().includes(query) ||
        feedback.message?.toLowerCase().includes(query)
      );
    })
    .map((feedback) => {
      const emails = emailThreads.filter((e) => e.feedback_id === feedback.id);
      const allDates = [feedback.created_at, ...emails.map((e) => e.created_at)];
      const lastActivity = allDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
      const hasUnreplied = !feedback.replied_at;

      return {
        feedback,
        emails,
        lastActivity,
        hasUnreplied,
      };
    })
    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());

  const currentConversation = conversations.find((c) => c.feedback.id === selectedFeedbackId);

  // Send reply
  const sendReply = useMutation({
    mutationFn: async (message: string) => {
      if (!currentConversation) throw new Error('No conversation selected');

      const response = await fetch('/api/feedback/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbackId: currentConversation.feedback.id,
          to: currentConversation.feedback.email,
          subject: `Re: Your ${currentConversation.feedback.feedback_type} feedback`,
          message,
          userName: currentConversation.feedback.name || currentConversation.feedback.email,
          originalMessage: currentConversation.feedback.message,
          feedbackType: currentConversation.feedback.feedback_type,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send reply');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Reply sent' });
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

  const handleSendMessage = (message: string) => {
    sendReply.mutate(message);
  };

  // Convert to ChatMessage format
  const chatMessages: ChatMessage[] = currentConversation
    ? [
        // Original feedback as first message
        {
          id: `feedback-${currentConversation.feedback.id}`,
          content: currentConversation.feedback.message,
          timestamp: currentConversation.feedback.created_at,
          direction: 'inbound' as const,
          subject: 'Original Feedback',
        },
        // Email thread messages
        ...currentConversation.emails.map((email) => ({
          id: email.id,
          content: email.body_text || '',
          timestamp: email.created_at,
          direction: email.direction,
          subject: email.subject || undefined,
        })),
      ]
    : [];

  const stats = {
    total: feedbackList.length,
    pending: feedbackList.filter((f) => !f.replied_at).length,
  };

  return (
    <div className="flex h-full overflow-hidden rounded-lg border bg-white dark:bg-gray-900">
      {/* Conversations List */}
      <div className="flex w-96 flex-shrink-0 flex-col border-r">
        <div className="flex flex-shrink-0 items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span className="font-semibold">Feedback</span>
            {stats.pending > 0 && (
              <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                {stats.pending}
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCw className={cn('h-4 w-4', loadingFeedback && 'animate-spin')} />
          </Button>
        </div>

        {/* Filters */}
        <div className="flex-shrink-0 border-b p-3 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 text-sm"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="bug">Bug Report</SelectItem>
              <SelectItem value="feature">Feature Request</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          {loadingFeedback ? (
            <div className="p-4 text-center text-muted-foreground">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No feedback found</div>
          ) : (
            <div className="divide-y">
              {conversations.map((conv) => {
                const typeConfig = feedbackTypeConfig[conv.feedback.feedback_type] || feedbackTypeConfig.other;
                const TypeIcon = typeConfig.icon;

                return (
                  <button
                    key={conv.feedback.id}
                    onClick={() => setSelectedFeedbackId(conv.feedback.id)}
                    className={cn(
                      'w-full p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800',
                      selectedFeedbackId === conv.feedback.id && 'bg-gray-100 dark:bg-gray-800',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={cn(
                            'truncate text-sm',
                            conv.hasUnreplied && 'font-semibold'
                          )}>
                            {conv.feedback.name?.replace('iTracksy:', '') || 'Anonymous'}
                          </span>
                          <span className="flex-shrink-0 text-xs text-muted-foreground">
                            {formatTime(conv.lastActivity)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="secondary" className={cn('text-xs px-1.5 py-0', typeConfig.color)}>
                            <TypeIcon className="h-3 w-3 mr-1" />
                            {typeConfig.label}
                          </Badge>
                          {conv.emails.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {conv.emails.length} replies
                            </span>
                          )}
                        </div>
                        <p className={cn(
                          'mt-1 truncate text-sm text-muted-foreground',
                          conv.hasUnreplied && 'font-medium text-foreground'
                        )}>
                          {conv.feedback.message}
                        </p>
                      </div>
                      {conv.hasUnreplied && (
                        <Circle className="h-2.5 w-2.5 flex-shrink-0 fill-orange-500 text-orange-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      {currentConversation ? (
        <ChatBox
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          isSending={sendReply.isPending}
          disabled={!currentConversation.feedback.email}
          showAttachments={false}
          headerContent={
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {currentConversation.feedback.name?.replace('iTracksy:', '') || 'Anonymous'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentConversation.feedback.email || 'No email'}
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={feedbackTypeConfig[currentConversation.feedback.feedback_type]?.color}
              >
                {feedbackTypeConfig[currentConversation.feedback.feedback_type]?.label || 'Other'}
              </Badge>
            </>
          }
        />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
          <MessageSquare className="mb-4 h-16 w-16" />
          <p className="text-lg">Select a feedback</p>
          <p className="text-sm">Choose a feedback from the left to view conversation</p>
        </div>
      )}
    </div>
  );
}
