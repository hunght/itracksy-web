'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { Campaign } from '@/types/campaigns';
import { Tables } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddLeadsToCampaignModalProps {
  campaign: Campaign;
}

export function AddLeadsToCampaignModal({
  campaign,
}: AddLeadsToCampaignModalProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const supabase = useSupabaseBrowser();

  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Tables<'leads'>[];
    },
    enabled: open,
  });

  const { data: groups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['lead-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('group')
        .not('group', 'is', null);

      if (error) throw error;

      const uniqueGroups = Array.from(
        new Set(data.map((item) => item.group).filter(Boolean)),
      );
      return uniqueGroups as string[];
    },
    enabled: open,
  });

  const { data: existingCampaignLeads } = useQuery({
    queryKey: ['campaign-leads', campaign.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_leads')
        .select('lead_id')
        .eq('campaign_id', campaign.id);

      if (error) throw error;
      return data.map((item) => item.lead_id);
    },
    enabled: open,
  });

  const { mutate: addLeadsToCampaign, isPending } = useMutation({
    mutationFn: async (leadIds: string[]) => {
      const newLeadIds = leadIds.filter(
        (id) => !existingCampaignLeads?.includes(id),
      );

      if (newLeadIds.length === 0) {
        return { added: 0 };
      }

      const campaignLeads = newLeadIds.map((lead_id) => ({
        campaign_id: campaign.id,
        lead_id,
        status: 'pending',
      }));

      const { data, error } = await supabase
        .from('campaign_leads')
        .insert(campaignLeads)
        .select();

      if (error) throw error;
      return { added: data.length };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ['campaign-leads', campaign.id],
      });
      setOpen(false);
      setSelectedLeads([]);
      toast({
        title: 'Leads Added',
        description: `Successfully added ${result.added} leads to campaign "${campaign.name}"`,
      });
    },
    onError: (error) => {
      console.error('Error adding leads to campaign:', error);
      toast({
        title: 'Error',
        description: 'Failed to add leads to campaign. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const filteredLeads = leads
    ?.filter((lead) => !existingCampaignLeads?.includes(lead.id))
    ?.filter((lead) => {
      const matchesSearch =
        lead.name?.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase());

      const matchesGroup = !selectedGroup || lead.group === selectedGroup;

      return matchesSearch && matchesGroup;
    });

  const toggleLead = (leadId: string) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId],
    );
  };

  const handleSelectAll = () => {
    if (filteredLeads?.length === selectedLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads?.map((lead) => lead.id) || []);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add Leads
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Leads to Campaign</DialogTitle>
          <DialogDescription>
            Only leads not yet added to this campaign are shown below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Search leads by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-40">
              <Select
                value={selectedGroup || 'all'}
                onValueChange={(value) =>
                  setSelectedGroup(value === 'all' ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  {groups?.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-[300px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={
                      filteredLeads?.length === selectedLeads.length &&
                      filteredLeads?.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all">Select All</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedLeads.length} selected
                </p>
              </div>

              <ScrollArea className="h-[300px] rounded-md border p-2">
                {filteredLeads?.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    {search || selectedGroup
                      ? 'No matching leads found'
                      : 'All leads have already been added to this campaign'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredLeads?.map((lead) => (
                      <div
                        key={lead.id}
                        className="flex items-center space-x-2 rounded p-2 hover:bg-muted"
                      >
                        <Checkbox
                          id={`lead-${lead.id}`}
                          checked={selectedLeads.includes(lead.id)}
                          onCheckedChange={() => toggleLead(lead.id)}
                        />
                        <div className="min-w-0 flex-1">
                          <Label
                            htmlFor={`lead-${lead.id}`}
                            className="flex cursor-pointer items-center justify-between"
                          >
                            <div>
                              <p className="truncate font-medium">
                                {lead.name}
                              </p>
                              <p className="truncate text-sm text-muted-foreground">
                                {lead.email}
                                {lead.group && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    Group: {lead.group}
                                  </span>
                                )}
                              </p>
                            </div>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => addLeadsToCampaign(selectedLeads)}
              disabled={selectedLeads.length === 0 || isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Add {selectedLeads.length} Leads
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
