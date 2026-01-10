'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { ChatBox, ChatMessage } from '@/components/chat-box';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Inbox,
  Circle,
  Plus,
  Search,
  Bug,
  Lightbulb,
  MessageSquare,
  HelpCircle,
  Loader2,
  Mail,
  Megaphone,
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
  body_html: string | null;
  direction: 'inbound' | 'outbound';
  is_read: boolean;
  feedback_id: string | null;
  campaign_id: string | null;
  lead_id: string | null;
  created_at: string;
};

type Campaign = {
  id: string;
  name: string;
  email_subject: string;
  status: string;
};

type UnifiedConversation = {
  id: string; // unique key: `${email}-${normalizedSubject}`
  email: string;
  name: string | null;
  subject: string;
  feedbackId: string | null;
  feedbackType: string | null;
  feedbackMessage: string | null;
  feedbackCreatedAt: string | null;
  campaignId: string | null;
  campaignName: string | null;
  leadId: string | null;
  messages: EmailThread[];
  lastActivity: string;
  unreadCount: number;
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
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    label: 'Feature',
  },
  other: {
    icon: HelpCircle,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    label: 'Other',
  },
};

// Normalize subject by removing Re:, Fwd:, FW: prefixes
function normalizeSubject(subject: string | null): string {
  if (!subject) return '(no subject)';
  return subject.replace(/^(re|fwd|fw):\s*/gi, '').trim() || '(no subject)';
}

// Create unique conversation key
function getConversationKey(email: string, subject: string): string {
  return `${email.toLowerCase()}-${normalizeSubject(subject).toLowerCase()}`;
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function InboxPage() {
  const supabase = useSupabaseBrowser();
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isSendingNew, setIsSendingNew] = useState(false);

  // Fetch campaigns for filter
  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ['inbox-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('id, name, email_subject, status')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Campaign[];
    },
  });

  // Fetch feedback
  const {
    data: feedbackList = [],
    isLoading: loadingFeedback,
    refetch: refetchFeedback,
  } = useQuery<Feedback[]>({
    queryKey: ['unified-inbox-feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Feedback[];
    },
  });

  // Fetch all email threads
  const {
    data: emailThreads = [],
    isLoading: loadingEmails,
    refetch: refetchEmails,
  } = useQuery<EmailThread[]>({
    queryKey: ['unified-inbox-emails'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('email_threads')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as EmailThread[];
    },
  });

  const isLoading = loadingFeedback || loadingEmails;

  const refetch = () => {
    refetchFeedback();
    refetchEmails();
  };

  // Build unified conversations grouped by email + subject
  const conversations: UnifiedConversation[] = (() => {
    const conversationMap = new Map<string, UnifiedConversation>();

    // First, create conversations from feedback
    feedbackList.forEach((feedback) => {
      if (!feedback.email) return;

      // For feedback, use the feedback_type as part of the subject
      const subject = `${feedback.feedback_type || 'general'} feedback`;
      const key = getConversationKey(feedback.email, subject);

      conversationMap.set(key, {
        id: key,
        email: feedback.email,
        name: feedback.name?.replace('iTracksy:', '') || null,
        subject: normalizeSubject(subject),
        feedbackId: feedback.id,
        feedbackType: feedback.feedback_type,
        feedbackMessage: feedback.message,
        feedbackCreatedAt: feedback.created_at,
        campaignId: null,
        campaignName: null,
        leadId: null,
        messages: [],
        lastActivity: feedback.created_at,
        unreadCount: 0,
        hasUnreplied: !feedback.replied_at,
      });
    });

    // Then, add emails to conversations
    emailThreads.forEach((email) => {
      const emailAddress =
        email.direction === 'inbound' ? email.from_email : email.to_email;
      const subject = email.subject || '(no subject)';
      const key = getConversationKey(emailAddress, subject);

      // If this email has a feedback_id, try to find that feedback's conversation
      let targetKey = key;
      if (email.feedback_id) {
        const feedback = feedbackList.find((f) => f.id === email.feedback_id);
        if (feedback) {
          const feedbackSubject = `${feedback.feedback_type || 'general'} feedback`;
          targetKey = getConversationKey(feedback.email, feedbackSubject);
        }
      }

      // Find campaign name if this email is from a campaign
      const emailCampaign = email.campaign_id
        ? campaigns.find((c) => c.id === email.campaign_id)
        : null;

      if (conversationMap.has(targetKey)) {
        // Add to existing conversation
        const conv = conversationMap.get(targetKey)!;
        conv.messages.push(email);
        if (new Date(email.created_at) > new Date(conv.lastActivity)) {
          conv.lastActivity = email.created_at;
        }
        if (!email.is_read && email.direction === 'inbound') {
          conv.unreadCount++;
        }
        // Update campaign info if not already set
        if (!conv.campaignId && email.campaign_id) {
          conv.campaignId = email.campaign_id;
          conv.campaignName = emailCampaign?.name || null;
        }
        if (!conv.leadId && email.lead_id) {
          conv.leadId = email.lead_id;
        }
      } else {
        // Create new conversation from email
        conversationMap.set(key, {
          id: key,
          email: emailAddress,
          name:
            email.direction === 'inbound'
              ? email.from_name
              : email.from_name || null,
          subject: normalizeSubject(subject),
          feedbackId: email.feedback_id,
          feedbackType: null,
          feedbackMessage: null,
          feedbackCreatedAt: null,
          campaignId: email.campaign_id,
          campaignName: emailCampaign?.name || null,
          leadId: email.lead_id,
          messages: [email],
          lastActivity: email.created_at,
          unreadCount: !email.is_read && email.direction === 'inbound' ? 1 : 0,
          hasUnreplied: email.direction === 'inbound',
        });
      }
    });

    // Sort messages within each conversation
    conversationMap.forEach((conv) => {
      conv.messages.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
      // Update hasUnreplied based on last message
      if (conv.messages.length > 0) {
        const lastMsg = conv.messages[conv.messages.length - 1];
        conv.hasUnreplied = lastMsg.direction === 'inbound';
      }
    });

    // Convert to array and filter
    return Array.from(conversationMap.values())
      .filter((conv) => {
        // Campaign filter
        if (campaignFilter !== 'all') {
          if (campaignFilter === 'campaigns') {
            // Show only conversations from campaigns
            if (!conv.campaignId) return false;
          } else {
            // Filter by specific campaign
            if (conv.campaignId !== campaignFilter) return false;
          }
        }

        // Type filter - also check subject for keywords
        if (typeFilter !== 'all') {
          const subjectLower = conv.subject.toLowerCase();
          const matchesFeedbackType = conv.feedbackType === typeFilter;
          const matchesSubjectKeyword =
            (typeFilter === 'bug' &&
              (subjectLower.includes('bug') ||
                subjectLower.includes('error'))) ||
            (typeFilter === 'feature' &&
              (subjectLower.includes('feature') ||
                subjectLower.includes('request'))) ||
            (typeFilter === 'general' && subjectLower.includes('general'));

          if (!matchesFeedbackType && !matchesSubjectKeyword) {
            return false;
          }
        }
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            conv.name?.toLowerCase().includes(query) ||
            conv.email.toLowerCase().includes(query) ||
            conv.subject.toLowerCase().includes(query) ||
            conv.feedbackMessage?.toLowerCase().includes(query) ||
            conv.campaignName?.toLowerCase().includes(query) ||
            conv.messages.some((m) =>
              m.body_text?.toLowerCase().includes(query),
            )
          );
        }
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.lastActivity).getTime() -
          new Date(a.lastActivity).getTime(),
      );
  })();

  const currentConversation = conversations.find(
    (c) => c.id === selectedConversationId,
  );

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
      refetchEmails();
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
  }, [selectedConversationId]);

  // Send reply
  const sendReply = useMutation({
    mutationFn: async (message: string) => {
      if (!currentConversation) throw new Error('No conversation selected');

      const lastInbound = [...currentConversation.messages]
        .reverse()
        .find((m) => m.direction === 'inbound');

      const response = await fetch('/api/feedback/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbackId: currentConversation.feedbackId || 'direct-email',
          to: currentConversation.email,
          subject: `Re: ${currentConversation.subject}`,
          message,
          userName: currentConversation.name || currentConversation.email,
          originalMessage: currentConversation.feedbackMessage || '',
          feedbackType: currentConversation.feedbackType || 'email',
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
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Failed to send',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const handleSendMessage = (message: string) => {
    sendReply.mutate(message);
  };

  // Send new conversation
  const handleSendNewConversation = async () => {
    if (!newEmail.trim() || !newSubject.trim() || !newMessage.trim()) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSendingNew(true);
    try {
      const response = await fetch('/api/feedback/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbackId: 'direct-email',
          to: newEmail.trim(),
          subject: newSubject.trim(),
          message: newMessage.trim(),
          userName: newEmail.trim().split('@')[0],
          originalMessage: '',
          feedbackType: 'email',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      toast({ title: 'Message sent' });
      setComposeOpen(false);
      setNewEmail('');
      setNewSubject('');
      setNewMessage('');
      refetch();
    } catch (error) {
      toast({
        title: 'Failed to send',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSendingNew(false);
    }
  };

  // Convert to ChatMessage format
  const chatMessages: ChatMessage[] = currentConversation
    ? [
        // Original feedback as first message if exists
        ...(currentConversation.feedbackMessage
          ? [
              {
                id: `feedback-${currentConversation.feedbackId}`,
                content: currentConversation.feedbackMessage,
                timestamp: currentConversation.feedbackCreatedAt!,
                direction: 'inbound' as const,
                subject: 'Original Feedback',
              },
            ]
          : []),
        // Email thread messages
        ...currentConversation.messages.map((m) => ({
          id: m.id,
          content: m.body_text || '',
          timestamp: m.created_at,
          direction: m.direction,
          subject: m.subject || undefined,
        })),
      ]
    : [];

  const stats = {
    total: conversations.length,
    unread: conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    pending: conversations.filter((c) => c.hasUnreplied).length,
  };

  return (
    <div className="flex h-full overflow-hidden rounded-lg border bg-white dark:bg-gray-900">
      {/* Conversations List */}
      <div className="flex w-96 flex-shrink-0 flex-col border-r">
        <div className="flex flex-shrink-0 items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Inbox className="h-5 w-5" />
            <span className="font-semibold">Inbox</span>
            {stats.pending > 0 && (
              <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                {stats.pending}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setComposeOpen(true)}
              title="New conversation"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              <RefreshCw
                className={cn('h-4 w-4', isLoading && 'animate-spin')}
              />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex-shrink-0 space-y-2 border-b p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-9 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-8 flex-1 text-sm">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="bug">Bug Reports</SelectItem>
                <SelectItem value="feature">Feature Requests</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={campaignFilter} onValueChange={setCampaignFilter}>
              <SelectTrigger className="h-8 flex-1 text-sm">
                <SelectValue placeholder="All campaigns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="campaigns">
                  <div className="flex items-center gap-1">
                    <Megaphone className="h-3 w-3" />
                    All Campaigns
                  </div>
                </SelectItem>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading...
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No conversations
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conv) => {
                const typeConfig = conv.feedbackType
                  ? feedbackTypeConfig[conv.feedbackType] ||
                    feedbackTypeConfig.other
                  : null;
                const TypeIcon = typeConfig?.icon;

                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversationId(conv.id)}
                    className={cn(
                      'w-full p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800',
                      selectedConversationId === conv.id &&
                        'bg-gray-100 dark:bg-gray-800',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={cn(
                              'truncate text-sm',
                              (conv.unreadCount > 0 || conv.hasUnreplied) &&
                                'font-semibold',
                            )}
                          >
                            {conv.name || conv.email.split('@')[0]}
                          </span>
                          <span className="flex-shrink-0 text-xs text-muted-foreground">
                            {formatTime(conv.lastActivity)}
                          </span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {conv.email}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                          {conv.campaignId && (
                            <Badge
                              variant="secondary"
                              className="bg-purple-100 px-1.5 py-0 text-xs text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                            >
                              <Megaphone className="mr-1 h-3 w-3" />
                              {conv.campaignName || 'Campaign'}
                            </Badge>
                          )}
                          {typeConfig && TypeIcon && (
                            <Badge
                              variant="secondary"
                              className={cn(
                                'px-1.5 py-0 text-xs',
                                typeConfig.color,
                              )}
                            >
                              <TypeIcon className="mr-1 h-3 w-3" />
                              {typeConfig.label}
                            </Badge>
                          )}
                          <span className="truncate text-xs text-muted-foreground">
                            {conv.subject}
                          </span>
                        </div>
                        <p
                          className={cn(
                            'mt-1 truncate text-sm text-muted-foreground',
                            (conv.unreadCount > 0 || conv.hasUnreplied) &&
                              'font-medium text-foreground',
                          )}
                        >
                          {conv.messages.length > 0
                            ? conv.messages[conv.messages.length - 1]
                                .body_text || conv.subject
                            : conv.feedbackMessage || conv.subject}
                        </p>
                      </div>
                      {(conv.unreadCount > 0 || conv.hasUnreplied) && (
                        <Circle
                          className={cn(
                            'h-2.5 w-2.5 flex-shrink-0',
                            conv.unreadCount > 0
                              ? 'fill-blue-500 text-blue-500'
                              : 'fill-orange-500 text-orange-500',
                          )}
                        />
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
          showAttachments={false}
          headerContent={
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {currentConversation.name ||
                      currentConversation.email.split('@')[0]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentConversation.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {currentConversation.campaignId && (
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                  >
                    <Megaphone className="mr-1 h-3 w-3" />
                    {currentConversation.campaignName || 'Campaign'}
                  </Badge>
                )}
                {currentConversation.feedbackType && (
                  <Badge
                    variant="secondary"
                    className={
                      feedbackTypeConfig[currentConversation.feedbackType]
                        ?.color
                    }
                  >
                    {feedbackTypeConfig[currentConversation.feedbackType]
                      ?.label || 'Other'}
                  </Badge>
                )}
              </div>
            </>
          }
        />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
          <Inbox className="mb-4 h-16 w-16" />
          <p className="text-lg">Select a conversation</p>
          <p className="text-sm">
            Choose a conversation from the left to start messaging
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setComposeOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Conversation
          </Button>
        </div>
      )}

      {/* Compose New Conversation Dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
            <DialogDescription>
              Send a new email to start a conversation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                type="email"
                placeholder="email@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Enter subject..."
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message..."
                rows={6}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setComposeOpen(false)}
              disabled={isSendingNew}
            >
              Cancel
            </Button>
            <Button onClick={handleSendNewConversation} disabled={isSendingNew}>
              {isSendingNew ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
