'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { CreateLeadModal } from '@/components/leads/create-lead-modal';
import { UploadLeadsModal } from '@/components/leads/upload-leads-modal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';

type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  beta_invite_sent?: boolean;
};

export default function LeadsPage() {
  const supabase = useSupabaseBrowser();
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([]);
  const [isSendingInvites, setIsSendingInvites] = useState(false);

  const {
    data: leadsList = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      // First get all leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (leadsError) throw leadsError;
      
      // Get all beta invites to check which leads have been sent invites
      const { data: betaInvites, error: invitesError } = await supabase
        .from('beta_invites')
        .select('email');
        
      if (invitesError) throw invitesError;
      
      // Create a set of emails that have been sent invites for faster lookup
      const invitedEmails = new Set(betaInvites.map(invite => invite.email));
      
      // Mark leads that have already been sent invites
      const leadsWithInviteStatus = leadsData.map(lead => ({
        ...lead,
        beta_invite_sent: invitedEmails.has(lead.email)
      }));
      
      return leadsWithInviteStatus as Lead[];
    },
  });

  // Handle lead selection
  const toggleLeadSelection = (lead: Lead) => {
    // Prevent selection of leads that have already been sent invites
    if (lead.beta_invite_sent) {
      toast.info(`${lead.name} has already been sent a beta invite`);
      return;
    }
    
    if (selectedLeads.some((selected) => selected.id === lead.id)) {
      setSelectedLeads(
        selectedLeads.filter((selected) => selected.id !== lead.id),
      );
    } else {
      setSelectedLeads([...selectedLeads, lead]);
    }
  };

  // Select/deselect all leads
  const toggleSelectAll = () => {
    if (selectedLeads.length === leadsList.filter(lead => !lead.beta_invite_sent).length) {
      setSelectedLeads([]);
    } else {
      // Only select leads that haven't been sent invites
      setSelectedLeads([...leadsList.filter(lead => !lead.beta_invite_sent)]);
    }
  };

  // Send beta invites to selected leads
  const sendBetaInvites = async () => {
    if (selectedLeads.length === 0) {
      toast.error('Please select at least one lead to send invites');
      return;
    }

    setIsSendingInvites(true);

    try {
      // Track successful and failed invites
      let successCount = 0;
      let failedCount = 0;

      // Process each lead sequentially to avoid overwhelming the server
      for (const lead of selectedLeads) {
        try {
          const response = await fetch('/api/beta-invite', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: lead.email,
              name: lead.name,
              leadId: lead.id, // Pass the lead ID to associate with the invite
              expiryDays: 14, // Two weeks expiry for leads
            }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            successCount++;
          } else {
            failedCount++;
            console.error(
              `Failed to send invite to ${lead.email}:`,
              data.error || 'Unknown error',
            );
          }

          // Small delay to prevent rate limiting
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error) {
          failedCount++;
          console.error(`Error sending invite to ${lead.email}:`, error);
        }
      }

      // Show summary toast
      if (successCount > 0) {
        toast.success(`Successfully sent ${successCount} beta invitations`);
        // Refresh the leads list to update the invite status
        refetch();
      }

      if (failedCount > 0) {
        toast.error(
          `Failed to send ${failedCount} invitations. Check console for details.`,
        );
      }
    } catch (error) {
      console.error('Error sending beta invites:', error);
      toast.error('An error occurred while sending invitations');
    } finally {
      setIsSendingInvites(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Leads Management</CardTitle>
          <div className="flex space-x-2">
            <CreateLeadModal />
            <UploadLeadsModal />
          </div>
        </CardHeader>
        <CardContent>
          {leadsList.length === 0 ? (
            <p>No leads available.</p>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="selectAll"
                    checked={
                      leadsList.filter(lead => !lead.beta_invite_sent).length > 0 &&
                      selectedLeads.length === leadsList.filter(lead => !lead.beta_invite_sent).length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                  <label htmlFor="selectAll" className="text-sm font-medium">
                    Select All
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {selectedLeads.length} of {leadsList.filter(lead => !lead.beta_invite_sent).length} available selected
                  </span>
                  {selectedLeads.length > 0 && (
                    <Button
                      size="sm"
                      onClick={sendBetaInvites}
                      disabled={isSendingInvites}
                      className="flex items-center gap-2"
                    >
                      {isSendingInvites ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Beta Invites
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
              <ul className="space-y-4">
                {leadsList.map((lead) => (
                  <li key={lead.id} className="flex items-center border-b py-2">
                    <Checkbox
                      id={`lead-${lead.id}`}
                      checked={selectedLeads.some(
                        (selected) => selected.id === lead.id,
                      )}
                      onCheckedChange={() => toggleLeadSelection(lead)}
                      className="mr-3"
                      disabled={lead.beta_invite_sent}
                    />
                    <div className="grid flex-1 grid-cols-6 gap-4">
                      <span className="truncate font-semibold">
                        {lead.name}
                      </span>
                      <span className="truncate">{lead.email}</span>
                      <span className="truncate">{lead.phone}</span>
                      <span className="col-span-2 truncate">
                        {lead.message || 'No message'}
                      </span>
                      <span className="text-right">
                        {lead.beta_invite_sent ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Invite Sent
                          </span>
                        ) : null}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
