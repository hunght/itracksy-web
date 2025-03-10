'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useSupabaseBrowser } from '@/lib/supabase/client';

// Add this new type for our lead data
type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

export default function LeadsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();

  // Query for fetching leads
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

  // Mutation for submitting a new lead
  const { mutate: submitLead, isPending: isSubmitting } = useMutation({
    mutationFn: async (newLead: Omit<Lead, 'id' | 'created_at'>) => {
      const { error } = await supabase.from('leads').insert(newLead);
      if (error) throw error;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    submitLead(
      { name, email, phone, message },
      {
        onSuccess: () => {
          // Reset form
          setName('');
          setEmail('');
          setPhone('');
          setMessage('');
          // Invalidate and refetch the leads query
          queryClient.invalidateQueries({ queryKey: ['leads'] });
          toast({
            title: 'Lead Submitted',
            description: 'New lead has been added successfully!',
          });
        },
        onError: (error) => {
          console.error('Error submitting lead:', error);
          toast({
            title: 'Submission Error',
            description:
              'There was an error submitting the lead. Please try again.',
            variant: 'destructive',
          });
        },
      },
    );
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto mb-10 max-w-2xl">
        <CardHeader>
          <CardTitle>Manage Leads</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Lead name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Lead email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="Lead phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Input
                id="message"
                placeholder="Lead message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-4">
            <Button
              type="submit"
              variant="default"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Lead'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Submitted Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {leadsList.length === 0 ? (
            <p>No leads submitted yet.</p>
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
