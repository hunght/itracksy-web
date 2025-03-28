'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { Campaign, CampaignLead } from '@/types/campaigns';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { AddLeadsToCampaignModal } from './add-leads-to-campaign-modal';
import { SendCampaignModal } from './send-campaign-modal';

interface CampaignDetailsProps {
  campaign: Campaign;
  onUpdate: (campaign: Campaign) => void;
}

// Define a simplified type for campaign leads to avoid deep nesting
interface CampaignLeadWithLead {
  id: string;
  campaign_id: string;
  lead_id: string;
  status: string | null;
  sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  lead: {
    id: string;
    name: string;
    email: string;
    created_at: string;
  };
}

export function CampaignDetails({ campaign, onUpdate }: CampaignDetailsProps) {
  const [activeTab, setActiveTab] = useState('details');
  const queryClient = useQueryClient();
  const supabase = useSupabaseBrowser();

  const { data: campaignLeads, isLoading: isLoadingLeads } = useQuery({
    queryKey: ['campaign-leads', campaign.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_leads')
        .select(
          `
          id, campaign_id, lead_id, status, sent_at, opened_at, clicked_at,
          lead:leads(id, name, email, created_at)
        `,
        )
        .eq('campaign_id', campaign.id);

      if (error) throw error;
      return data;
    },
  });

  // Extract just the leads for the SendCampaignModal
  const leadsForCampaign =
    campaignLeads?.map((cl) => cl.lead).filter((lead) => lead !== null) || [];

  const { mutate: updateCampaignStatus, isPending: isUpdating } = useMutation({
    mutationFn: async (status: string) => {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .update({ status })
        .eq('id', campaign.id)
        .select('*')
        .single();

      if (error) throw error;
      return data as Campaign;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      onUpdate(data);
      toast({
        title: 'Campaign Updated',
        description: `Campaign status changed to ${data.status}`,
      });
    },
    onError: (error) => {
      console.error('Error updating campaign:', error);
      toast({
        title: 'Error',
        description: 'Failed to update campaign. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">{campaign.name}</h3>
          <p className="text-muted-foreground">{campaign.description}</p>
        </div>
        <div className="flex gap-2">
          {campaign.status === 'draft' && (
            <>
              <AddLeadsToCampaignModal campaign={campaign} />
              <SendCampaignModal
                campaign={campaign}
                leads={leadsForCampaign}
                onSent={(updatedCampaign) => onUpdate(updatedCampaign)}
              />
            </>
          )}
          {campaign.status === 'draft' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateCampaignStatus('active')}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Activate Campaign'
              )}
            </Button>
          )}
          {campaign.status === 'active' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateCampaignStatus('completed')}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Mark as Completed'
              )}
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="details">Campaign Details</TabsTrigger>
          <TabsTrigger value="leads">
            Leads{' '}
            <Badge variant="outline" className="ml-2">
              {campaignLeads?.length || 0}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="mb-1 text-sm font-medium">Status</h4>
              <Badge variant={getBadgeVariant(campaign.status)}>
                {formatStatus(campaign.status)}
              </Badge>
            </div>
            <div>
              <h4 className="mb-1 text-sm font-medium">Created</h4>
              <p className="text-sm">
                {new Date(campaign.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-1 text-sm font-medium">Email Subject</h4>
            <p className="rounded-md bg-muted p-2 text-sm">
              {campaign.email_subject}
            </p>
          </div>

          <div>
            <h4 className="mb-1 text-sm font-medium">Email Template</h4>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {campaign.email_template}
              </pre>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="leads">
          {isLoadingLeads ? (
            <div className="flex h-[200px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !campaignLeads?.length ? (
            <div className="rounded-md border py-8 text-center text-muted-foreground">
              No leads added to this campaign yet.
              {campaign.status === 'draft' && (
                <div className="mt-4">
                  <AddLeadsToCampaignModal campaign={campaign} />
                </div>
              )}
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {campaignLeads.map((campaignLead) => (
                  <div key={campaignLead.id} className="rounded-md border p-3">
                    <div className="flex justify-between">
                      <h4 className="font-medium">
                        {campaignLead.lead?.name || 'Unknown'}
                      </h4>
                      <Badge variant="outline" className="ml-2">
                        {campaignLead.status || 'Pending'}
                      </Badge>
                    </div>
                    <p className="text-sm">
                      {campaignLead.lead?.email || 'No email'}
                    </p>
                    {campaignLead.sent_at && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Sent: {new Date(campaignLead.sent_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getBadgeVariant(
  status: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'active':
      return 'default';
    case 'draft':
      return 'secondary';
    case 'completed':
      return 'outline';
    case 'failed':
      return 'destructive';
    default:
      return 'secondary';
  }
}
