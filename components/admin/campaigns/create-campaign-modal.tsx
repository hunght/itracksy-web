'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Campaign } from '@/types/campaigns';

const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  description: z.string().min(1, 'Campaign description is required'),
  email_subject: z.string().min(1, 'Email subject is required'),
  email_template: z.string().min(1, 'Email template is required'),
});

type CampaignForm = z.infer<typeof campaignSchema>;

interface CreateCampaignModalProps {
  onCampaignCreated?: (campaign: Campaign) => void;
}

export function CreateCampaignModal({
  onCampaignCreated,
}: CreateCampaignModalProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const supabase = useSupabaseBrowser();

  const form = useForm<CampaignForm>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      description: '',
      email_subject: '',
      email_template:
        'Hi {{name}},\n\nWe thought you might be interested in...\n\nBest regards,\nThe iTRACKsy Team',
    },
  });

  const { mutate: createCampaign, isPending } = useMutation({
    mutationFn: async (data: CampaignForm) => {
      const { data: campaign, error } = await supabase
        .from('marketing_campaigns')
        .insert({
          name: data.name,
          description: data.description,
          email_subject: data.email_subject,
          email_template: data.email_template,
          status: 'draft',
        })
        .select('*')
        .single();

      if (error) throw error;
      return campaign as Campaign;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: 'Campaign Created',
        description: `Successfully created campaign "${data.name}"`,
      });
      setOpen(false);
      form.reset();
      if (onCampaignCreated) onCampaignCreated(data);
    },
    onError: (error) => {
      console.error('Error creating campaign:', error);
      toast({
        title: 'Error',
        description: 'Failed to create campaign. Please try again.',
        variant: 'destructive',
      });
    },
  });

  function onSubmit(data: CampaignForm) {
    createCampaign(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Campaign</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Spring Promotion 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Campaign details and target audience"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email_subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Subject</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Special offer just for you"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email_template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Template</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Hi {{name}}, ..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Use {{ name }} and {{ email }} as placeholders that will be
                    replaced with lead data.
                  </p>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Campaign'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
