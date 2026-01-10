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
import {
  Loader2,
  Mail,
  Eye,
  MousePointer,
  AlertCircle,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import { AddLeadsToCampaignModal } from './add-leads-to-campaign-modal';
import { SendCampaignModal } from './send-campaign-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';

interface CampaignDetailsProps {
  campaign: Campaign;
  onUpdate: (campaign: Campaign) => void;
}

// Define a simplified type for campaign leads to avoid deep nesting
interface CampaignLeadWithLeadData {
  id: string;
  campaign_id: string;
  lead_id: string;
  status: string | null;
  sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  lead: {
    id: string;
    name: string | null;
    email: string;
    created_at: string;
  } | null;
}

export function CampaignDetails({ campaign, onUpdate }: CampaignDetailsProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [editingSubject, setEditingSubject] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(false);
  const [subjectValue, setSubjectValue] = useState(campaign.email_subject);
  const [templateValue, setTemplateValue] = useState(campaign.email_template);
  const queryClient = useQueryClient();
  const supabase = useSupabaseBrowser();

  const { data: campaignLeads, isLoading: isLoadingLeads } = useQuery({
    queryKey: ['campaign-leads', campaign.id],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = (await (supabase as any)
        .from('campaign_leads')
        .select(
          `
          id, campaign_id, lead_id, status, sent_at, opened_at, clicked_at,
          lead:leads(id, name, email, created_at)
        `,
        )
        .eq('campaign_id', campaign.id)) as {
        data: CampaignLeadWithLeadData[] | null;
        error: Error | null;
      };

      if (error) throw error;
      return data;
    },
  });

  // Extract just the leads for the SendCampaignModal
  const leadsForCampaign =
    campaignLeads
      ?.map((cl) => cl.lead)
      .filter((lead): lead is NonNullable<typeof lead> => lead !== null) || [];

  const { mutate: updateCampaignStatus, isPending: isUpdating } = useMutation({
    mutationFn: async (status: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = (await (supabase as any)
        .from('marketing_campaigns')
        .update({ status })
        .eq('id', campaign.id)
        .select('*')
        .single()) as { data: Campaign | null; error: Error | null };

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

  const { mutate: updateCampaignField, isPending: isUpdatingField } =
    useMutation({
      mutationFn: async ({
        field,
        value,
      }: {
        field: string;
        value: string;
      }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = (await (supabase as any)
          .from('marketing_campaigns')
          .update({ [field]: value })
          .eq('id', campaign.id)
          .select('*')
          .single()) as { data: Campaign | null; error: Error | null };

        if (error) throw error;
        return data as Campaign;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        onUpdate(data);
        toast({
          title: 'Campaign Updated',
          description: 'Campaign details have been updated',
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

  const handleSaveSubject = () => {
    if (subjectValue !== campaign.email_subject) {
      updateCampaignField({ field: 'email_subject', value: subjectValue });
    }
    setEditingSubject(false);
  };

  const handleSaveTemplate = () => {
    if (templateValue !== campaign.email_template) {
      updateCampaignField({ field: 'email_template', value: templateValue });
    }
    setEditingTemplate(false);
  };

  const handleCancelSubjectEdit = () => {
    setSubjectValue(campaign.email_subject);
    setEditingSubject(false);
  };

  const handleCancelTemplateEdit = () => {
    setTemplateValue(campaign.email_template);
    setEditingTemplate(false);
  };

  // Calculate campaign statistics
  const totalLeads = campaignLeads?.length || 0;
  const sentLeads = campaignLeads?.filter((lead) => lead.sent_at)?.length || 0;
  const openedLeads =
    campaignLeads?.filter((lead) => lead.opened_at)?.length || 0;
  const clickedLeads =
    campaignLeads?.filter((lead) => lead.clicked_at)?.length || 0;

  const openRate = sentLeads > 0 ? (openedLeads / sentLeads) * 100 : 0;
  const clickRate = sentLeads > 0 ? (clickedLeads / sentLeads) * 100 : 0;
  const clickToOpenRate =
    openedLeads > 0 ? (clickedLeads / openedLeads) * 100 : 0;

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
          <TabsTrigger value="stats">Statistics</TabsTrigger>
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
            <div className="mb-1 flex items-center justify-between">
              <h4 className="text-sm font-medium">Email Subject</h4>
              {!editingSubject && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingSubject(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="rounded-md border p-4">
              {editingSubject ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={subjectValue}
                    onChange={(e) => setSubjectValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSaveSubject}
                    disabled={isUpdatingField}
                  >
                    {isUpdatingField ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCancelSubjectEdit}
                    disabled={isUpdatingField}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <p className="text-sm">{campaign.email_subject}</p>
              )}
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <h4 className="text-sm font-medium">Email Template ID</h4>
              {!editingTemplate && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingTemplate(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="rounded-md border p-4">
              {editingTemplate ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={templateValue}
                    onChange={(e) => setTemplateValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSaveTemplate}
                    disabled={isUpdatingField}
                  >
                    {isUpdatingField ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCancelTemplateEdit}
                    disabled={isUpdatingField}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <p className="text-sm">{campaign.email_template}</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats">
          {isLoadingLeads ? (
            <div className="flex h-[200px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Recipients
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{totalLeads}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Sent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <p className="text-2xl font-bold">{sentLeads}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Opened
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-green-500" />
                      <p className="text-2xl font-bold">{openedLeads}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Clicked
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <MousePointer className="h-4 w-4 text-blue-500" />
                      <p className="text-2xl font-bold">{clickedLeads}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <h4 className="font-medium">Open Rate</h4>
                        </div>
                        <span className="font-bold">
                          {openRate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={openRate} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Percentage of sent emails that were opened (
                        {openedLeads} of {sentLeads})
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MousePointer className="h-4 w-4" />
                          <h4 className="font-medium">Click Rate</h4>
                        </div>
                        <span className="font-bold">
                          {clickRate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={clickRate} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Percentage of sent emails where links were clicked (
                        {clickedLeads} of {sentLeads})
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MousePointer className="h-4 w-4" />
                          <h4 className="font-medium">Click-to-Open Rate</h4>
                        </div>
                        <span className="font-bold">
                          {clickToOpenRate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={clickToOpenRate} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Percentage of opened emails where links were clicked (
                        {clickedLeads} of {openedLeads})
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
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
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {campaignLeads.map((campaignLead) => (
                  <div key={campaignLead.id} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        {campaignLead.lead?.name || 'Unknown'}
                      </h4>
                      <div className="flex space-x-2">
                        {campaignLead.status === 'bounced' && (
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1"
                          >
                            <AlertCircle className="h-3 w-3" />
                            Bounced
                          </Badge>
                        )}
                        {campaignLead.sent_at && (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Mail className="h-3 w-3" />
                            Sent
                          </Badge>
                        )}
                        {campaignLead.opened_at && (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            Opened
                          </Badge>
                        )}
                        {campaignLead.clicked_at && (
                          <Badge
                            variant="default"
                            className="flex items-center gap-1"
                          >
                            <MousePointer className="h-3 w-3" />
                            Clicked
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm">
                      {campaignLead.lead?.email || 'No email'}
                    </p>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      {campaignLead.sent_at && (
                        <div>
                          <span className="font-medium">Sent:</span>{' '}
                          {new Date(campaignLead.sent_at).toLocaleString()}
                        </div>
                      )}
                      {campaignLead.opened_at && (
                        <div>
                          <span className="font-medium">Opened:</span>{' '}
                          {new Date(campaignLead.opened_at).toLocaleString()}
                        </div>
                      )}
                      {campaignLead.clicked_at && (
                        <div>
                          <span className="font-medium">Clicked:</span>{' '}
                          {new Date(campaignLead.clicked_at).toLocaleString()}
                        </div>
                      )}
                    </div>
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
