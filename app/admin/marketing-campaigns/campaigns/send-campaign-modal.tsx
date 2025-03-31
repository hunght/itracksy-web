'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseBrowser } from '@/lib/supabase/client';
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
import { Loader2, Mail } from 'lucide-react';
import { Campaign } from '@/types/campaigns';

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
  const queryClient = useQueryClient();
  const supabase = useSupabaseBrowser();

  const { mutate: sendCampaign, isPending } = useMutation({
    mutationFn: async () => {
      // In a real implementation, this would call an API endpoint that sends emails
      // For now, we'll just simulate it by updating the campaign and campaign_leads status

      // Update campaign status
      const { data: updatedCampaign, error: campaignError } = await supabase
        .from('marketing_campaigns')
        .update({ status: 'active', sent_at: new Date().toISOString() })
        .eq('id', campaign.id)
        .select('*')
        .single();

      if (campaignError) throw campaignError;

      // Update campaign_leads status
      const { error: leadsError } = await supabase
        .from('campaign_leads')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .eq('campaign_id', campaign.id);

      if (leadsError) throw leadsError;

      // In a real implementation, you would:
      // 1. Call a serverless function or API endpoint
      // 2. That endpoint would process the campaign and send emails to each lead
      // 3. It would update the campaign and lead statuses accordingly

      return updatedCampaign as Campaign;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({
        queryKey: ['campaign-leads', campaign.id],
      });
      setOpen(false);
      onSent(data);
      toast({
        title: 'Campaign Sent',
        description: `Successfully sent campaign "${campaign.name}" to ${leads.length} leads`,
      });
    },
    onError: (error) => {
      console.error('Error sending campaign:', error);
      toast({
        title: 'Error',
        description: 'Failed to send campaign. Please try again.',
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
          <Mail className="mr-2 h-4 w-4" />
          Send Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Campaign Emails</DialogTitle>
          <DialogDescription>
            This will send emails to {leads.length} leads using the template
            below.
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

          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
            <p className="font-medium">Note:</p>
            <p>
              This is a simulated email campaign. In production, this would send
              real emails to the leads.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => sendCampaign()} disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Send to {leads.length} Leads
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
