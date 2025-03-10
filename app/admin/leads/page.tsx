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
};

export default function LeadsPage() {
  const supabase = useSupabaseBrowser();
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([]);
  const [isSendingInvites, setIsSendingInvites] = useState(false);

  const {
    data: leadsList = [],
    isLoading,
    isError,
  } = useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
  });

  // Handle lead selection
  const toggleLeadSelection = (lead: Lead) => {
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
    if (selectedLeads.length === leadsList.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads([...leadsList]);
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
              expiryDays: 14, // Two weeks expiry for leads
            }),
          });
          
          const data = await response.json();
          
          if (response.ok && data.success) {
            successCount++;
          } else {
            failedCount++;
            console.error(`Failed to send invite to ${lead.email}:`, data.error || 'Unknown error');
          }
          
          // Small delay to prevent rate limiting
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
          failedCount++;
          console.error(`Error sending invite to ${lead.email}:`, error);
        }
      }
      
      // Show summary toast
      if (successCount > 0) {
        toast.success(`Successfully sent ${successCount} beta invitations`);
      }
      
      if (failedCount > 0) {
        toast.error(`Failed to send ${failedCount} invitations. Check console for details.`);
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
                      leadsList.length > 0 &&
                      selectedLeads.length === leadsList.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                  <label htmlFor="selectAll" className="text-sm font-medium">
                    Select All
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {selectedLeads.length} of {leadsList.length} selected
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
                  <li key={lead.id} className="flex border-b pb-4">
                    <div className="mr-4 pt-1">
                      <Checkbox
                        id={`lead-${lead.id}`}
                        checked={selectedLeads.some(
                          (selected) => selected.id === lead.id,
                        )}
                        onCheckedChange={() => toggleLeadSelection(lead)}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{lead.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(lead.created_at).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                      <p className="text-sm text-gray-500">{lead.phone}</p>
                      <p className="mt-1">{lead.message}</p>
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
