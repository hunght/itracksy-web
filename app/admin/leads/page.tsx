'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { CreateLeadModal } from '@/components/leads/create-lead-modal';
import { UploadLeadsModal } from '@/components/leads/upload-leads-modal';

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
            <ul className="space-y-4">
              {leadsList.map((lead) => (
                <li key={lead.id} className="border-b pb-4">
                  <h3 className="font-semibold">{lead.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(lead.created_at).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">{lead.email}</p>
                  <p className="text-sm text-gray-500">{lead.phone}</p>
                  <p className="mt-1">{lead.message}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
