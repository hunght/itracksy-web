'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { CreateLeadModal } from '@/app/admin/leads/leads/create-lead-modal';
import { UploadLeadsModal } from '@/app/admin/leads/leads/upload-leads-modal';
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

  const {
    data: leadsList = [],
    isLoading,
    isError,
  } = useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (leadsError) throw leadsError;
      return leadsData as Lead[];
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
                    />
                    <div className="grid flex-1 grid-cols-5 gap-4">
                      <span className="truncate font-semibold">
                        {lead.name}
                      </span>
                      <span className="truncate">{lead.email}</span>
                      <span className="truncate">{lead.phone}</span>
                      <span className="col-span-2 truncate">
                        {lead.message || 'No message'}
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
