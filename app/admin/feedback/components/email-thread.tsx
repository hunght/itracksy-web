'use client';

import { useQuery } from '@tanstack/react-query';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Mail,
  Send,
  Inbox,
  Clock,
  User,
  CheckCheck,
  Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  created_at: string;
};

interface EmailThreadProps {
  feedbackId: string;
}

const formatDate = (dateString: string) => {
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
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
};

const formatFullDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function EmailThread({ feedbackId }: EmailThreadProps) {
  const supabase = useSupabaseBrowser();

  const { data: emails = [], isLoading } = useQuery<EmailThread[]>({
    queryKey: ['email-thread', feedbackId],
    queryFn: async () => {
      // Type assertion needed until Supabase types are regenerated
      const { data, error } = await (supabase as any)
        .from('email_threads')
        .select('*')
        .eq('feedback_id', feedbackId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as EmailThread[];
    },
    enabled: !!feedbackId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Mail className="mb-2 h-8 w-8" />
        <p className="text-sm">No email thread yet</p>
        <p className="text-xs">Send a reply to start the conversation</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {emails.map((email, index) => (
          <div
            key={email.id}
            className={cn(
              'rounded-lg border p-4',
              email.direction === 'outbound'
                ? 'ml-8 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                : 'mr-8 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800',
            )}
          >
            {/* Header */}
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full',
                    email.direction === 'outbound'
                      ? 'bg-blue-100 dark:bg-blue-800'
                      : 'bg-gray-100 dark:bg-gray-700',
                  )}
                >
                  {email.direction === 'outbound' ? (
                    <Send className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {email.from_name || email.from_email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {email.from_email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {email.direction === 'inbound' && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      'text-xs',
                      email.is_read
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-blue-100 text-blue-700',
                    )}
                  >
                    {email.is_read ? (
                      <CheckCheck className="mr-1 h-3 w-3" />
                    ) : (
                      <Circle className="mr-1 h-3 w-3 fill-current" />
                    )}
                    {email.is_read ? 'Read' : 'New'}
                  </Badge>
                )}
                <span
                  className="text-xs text-muted-foreground"
                  title={formatFullDate(email.created_at)}
                >
                  <Clock className="mr-1 inline h-3 w-3" />
                  {formatDate(email.created_at)}
                </span>
              </div>
            </div>

            {/* Subject (only show if different from previous) */}
            {email.subject &&
              (index === 0 || emails[index - 1]?.subject !== email.subject) && (
                <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {email.subject}
                </p>
              )}

            {/* Body */}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {email.body_text}
              </p>
            </div>

            {/* Direction indicator */}
            <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
              {email.direction === 'outbound' ? (
                <>
                  <Send className="h-3 w-3" />
                  <span>Sent to {email.to_email}</span>
                </>
              ) : (
                <>
                  <Inbox className="h-3 w-3" />
                  <span>Received</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
