'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Bug,
  Lightbulb,
  HelpCircle,
  Mail,
  Calendar,
  User,
} from 'lucide-react';

type Feedback = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  feedback_type: string;
  message: string;
  replied_at?: string | null;
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
    label: 'Bug Report',
  },
  feature: {
    icon: Lightbulb,
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    label: 'Feature Request',
  },
  other: {
    icon: HelpCircle,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    label: 'Other',
  },
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

interface FeedbackDetailModalProps {
  feedback: Feedback;
  open: boolean;
  onClose: () => void;
  onReply: () => void;
}

export function FeedbackDetailModal({
  feedback,
  open,
  onClose,
  onReply,
}: FeedbackDetailModalProps) {
  const typeConfig =
    feedbackTypeConfig[feedback.feedback_type] || feedbackTypeConfig.other;
  const TypeIcon = typeConfig.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Feedback Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className={`gap-1 ${typeConfig.color}`}>
              <TypeIcon className="h-3 w-3" />
              {typeConfig.label}
            </Badge>
            {feedback.replied_at ? (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              >
                Replied
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
              >
                Pending Reply
              </Badge>
            )}
          </div>

          {/* User Info */}
          <div className="grid gap-4 rounded-lg border bg-gray-50 p-4 dark:bg-gray-800 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">
                  {feedback.name?.replace('iTracksy:', '') || 'Anonymous'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{feedback.email || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Submitted on {formatDate(feedback.created_at)}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h4 className="font-medium">Message</h4>
            <div className="max-h-[300px] overflow-y-auto rounded-lg border bg-white p-4 dark:bg-gray-900">
              <p className="whitespace-pre-wrap text-sm">{feedback.message}</p>
            </div>
          </div>

          {/* Replied info */}
          {feedback.replied_at && (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
              <Mail className="h-4 w-4" />
              Replied on {formatDate(feedback.replied_at)}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {feedback.email && (
            <Button onClick={onReply}>
              <Mail className="mr-2 h-4 w-4" />
              Send Reply
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
