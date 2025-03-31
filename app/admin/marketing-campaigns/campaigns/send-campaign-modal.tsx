'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Send } from 'lucide-react';
import { Campaign } from '@/types/campaigns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Simplified lead type to avoid deep nesting
interface CampaignLead {
  id: string;
  name: string;
  email: string;
}

interface SendCampaignModalProps {
  campaign: Campaign;
  leads: CampaignLead[];
  onSent: (campaign: Campaign) => void;
}

export function SendCampaignModal({
  campaign,
  leads,
  onSent,
}: SendCampaignModalProps) {
  const [open, setOpen] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  const { mutate: sendTestEmail, isPending } = useMutation({
    mutationFn: async () => {
      if (!testEmail || !testEmail.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate sending test email
      console.log(`Sending test email to: ${testEmail}`);
      console.log(`Subject: ${campaign.email_subject}`);
      console.log(`Template: ${campaign.email_template}`);

      return { success: true, recipient: testEmail };
    },
    onSuccess: (data) => {
      toast({
        title: 'Test Email Sent',
        description: `Successfully sent test email to ${data.recipient}`,
      });
    },
    onError: (error) => {
      console.error('Error sending test email:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to send test email',
        variant: 'destructive',
      });
    },
  });

  if (!leads?.length) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <Send className="mr-2 h-4 w-4" />
          Test Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Test Email</DialogTitle>
          <DialogDescription>
            Preview how this campaign will look by sending a test email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border bg-muted/50 p-4">
            <p className="mb-1 text-sm font-medium">
              Subject: {campaign.email_subject}
            </p>
            <div className="mt-2 max-h-[200px] overflow-y-auto rounded-md bg-background p-3 text-sm">
              <pre className="whitespace-pre-wrap font-sans">
                {campaign.email_template}
              </pre>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-email">Test Email Address</Label>
            <Input
              id="test-email"
              type="email"
              placeholder="you@example.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Send a test email to preview how your campaign will look when
              received.
            </p>
          </div>

          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
            <p className="font-medium">Note:</p>
            <p>
              This is a test email only and will not be sent to actual campaign
              leads.
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={() => sendTestEmail()}
              disabled={isPending || !testEmail}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send Test Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
