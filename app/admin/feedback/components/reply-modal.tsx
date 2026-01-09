'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Mail, Send, Loader2 } from 'lucide-react';

type Feedback = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  feedback_type: string;
  message: string;
  replied_at?: string | null;
};

interface ReplyModalProps {
  feedback: Feedback;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReplyModal({
  feedback,
  open,
  onClose,
  onSuccess,
}: ReplyModalProps) {
  const userName = feedback.name?.replace('iTracksy:', '') || 'User';

  const [subject, setSubject] = useState(
    `Re: Your ${feedback.feedback_type} feedback - iTracksy`,
  );
  const [message, setMessage] = useState(
    `Hi ${userName},\n\nThank you for your feedback!\n\n\n\nBest regards,\niTracksy Team`,
  );

  const { mutate: sendReply, isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/feedback/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedbackId: feedback.id,
          to: feedback.email,
          subject,
          message,
          userName,
          originalMessage: feedback.message,
          feedbackType: feedback.feedback_type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send reply');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Reply Sent',
        description: `Your reply has been sent to ${feedback.email}`,
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: 'Failed to Send',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Reply to Feedback
          </DialogTitle>
          <DialogDescription>
            Send an email reply to {userName} ({feedback.email})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Original Message Preview */}
          <div className="rounded-lg border bg-gray-50 p-4 dark:bg-gray-800">
            <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
              Original Feedback
            </p>
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {feedback.message}
            </p>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your reply..."
              rows={10}
              className="resize-none font-mono text-sm"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={() => sendReply()}
            disabled={isPending || !subject.trim() || !message.trim()}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Reply
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
