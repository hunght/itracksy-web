'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, FileText, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Keep the schema for type definition but we won't use it for validation
const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  description: z.string().min(1, 'Campaign description is required'),
  email_subject: z.string().min(1, 'Email subject is required'),
  email_content: z.string().min(1, 'Email content is required'),
});

type CampaignForm = z.infer<typeof campaignSchema>;

interface CreateCampaignModalProps {
  onCampaignCreated?: (campaign: Campaign) => void;
}

// Simple markdown to HTML converter
function markdownToHtml(markdown: string): string {
  let html = markdown
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(
      /^### (.*$)/gm,
      '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>',
    )
    .replace(
      /^## (.*$)/gm,
      '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>',
    )
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-primary underline">$1</a>',
    )
    // Unordered lists
    .replace(/^\s*[-*]\s+(.*$)/gm, '<li class="ml-4">$1</li>')
    // Ordered lists
    .replace(/^\s*\d+\.\s+(.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Line breaks (double newline = paragraph)
    .replace(/\n\n/g, '</p><p class="my-2">')
    // Single line breaks
    .replace(/\n/g, '<br />');

  // Wrap in paragraph tags
  html = '<p class="my-2">' + html + '</p>';

  // Clean up empty paragraphs
  html = html.replace(/<p class="my-2"><\/p>/g, '');

  // Wrap consecutive list items in ul
  html = html.replace(
    /(<li[^>]*>.*?<\/li>)+/g,
    '<ul class="list-disc my-2">$&</ul>',
  );

  return html;
}

// Replace {{name}} with preview placeholder
function previewContent(content: string): string {
  return content.replace(
    /\{\{name\}\}/g,
    '<span class="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">John</span>',
  );
}

export function CreateCampaignModal({
  onCampaignCreated,
}: CreateCampaignModalProps) {
  const [open, setOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState<'write' | 'preview'>('write');
  const queryClient = useQueryClient();
  const supabase = useSupabaseBrowser();

  const form = useForm<CampaignForm>({
    defaultValues: {
      name: '',
      description: '',
      email_subject: '',
      email_content: `Hi {{name}},

Thank you for your interest in iTracksy!

## What's New

We're excited to share some updates with you:

- **Feature 1**: Description of the feature
- **Feature 2**: Another great feature
- **Feature 3**: One more thing you'll love

## Get Started

Click the link below to start using iTracksy today.

[Get Started](https://itracksy.com)

Best regards,
The iTracksy Team`,
    },
  });

  const emailContent = form.watch('email_content');

  // Custom validation function
  const validateForm = (data: CampaignForm) => {
    const errors: Partial<Record<keyof CampaignForm, string>> = {};

    if (!data.name) {
      errors.name = 'Campaign name is required';
      form.setError('name', { type: 'manual', message: errors.name });
    }

    if (!data.description) {
      errors.description = 'Campaign description is required';
      form.setError('description', {
        type: 'manual',
        message: errors.description,
      });
    }

    if (!data.email_subject) {
      errors.email_subject = 'Email subject is required';
      form.setError('email_subject', {
        type: 'manual',
        message: errors.email_subject,
      });
    }

    if (!data.email_content) {
      errors.email_content = 'Email content is required';
      form.setError('email_content', {
        type: 'manual',
        message: errors.email_content,
      });
    }

    return Object.keys(errors).length === 0;
  };

  const { mutate: createCampaign, isPending } = useMutation({
    mutationFn: async (data: CampaignForm) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: campaign, error } = (await (supabase as any)
        .from('marketing_campaigns')
        .insert({
          name: data.name,
          description: data.description,
          email_subject: data.email_subject,
          email_template: 'markdown', // Use 'markdown' as template type
          email_content: data.email_content, // Store the markdown content
          status: 'draft',
        })
        .select('*')
        .single()) as { data: Campaign | null; error: Error | null };

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
    if (validateForm(data)) {
      createCampaign(data);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Campaign</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column - Form Fields */}
              <div className="space-y-4">
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
                          rows={2}
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
                  name="email_content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Email Content (Markdown)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your email content in markdown..."
                          className="min-h-[280px] font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="flex items-start gap-2 rounded-md bg-muted p-2 text-xs text-muted-foreground">
                        <Info className="mt-0.5 h-3 w-3 flex-shrink-0" />
                        <span>
                          Use{' '}
                          <code className="rounded bg-background px-1">
                            {'{{name}}'}
                          </code>{' '}
                          to personalize with recipient&apos;s name. Supports
                          **bold**, *italic*, [links](url), and lists.
                        </span>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column - Preview */}
              <div className="flex flex-col">
                <Tabs
                  value={previewTab}
                  onValueChange={(v) => setPreviewTab(v as 'write' | 'preview')}
                  className="flex flex-1 flex-col"
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="write" className="flex-1">
                      <FileText className="mr-2 h-4 w-4" />
                      Guide
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex-1">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="write" className="flex-1">
                    <ScrollArea className="h-[400px] rounded-md border p-4">
                      <div className="space-y-4 text-sm">
                        <div>
                          <h4 className="font-semibold">Markdown Syntax</h4>
                          <div className="mt-2 space-y-2 text-muted-foreground">
                            <p>
                              <code className="rounded bg-muted px-1">
                                # Heading 1
                              </code>
                            </p>
                            <p>
                              <code className="rounded bg-muted px-1">
                                ## Heading 2
                              </code>
                            </p>
                            <p>
                              <code className="rounded bg-muted px-1">
                                **bold text**
                              </code>
                            </p>
                            <p>
                              <code className="rounded bg-muted px-1">
                                *italic text*
                              </code>
                            </p>
                            <p>
                              <code className="rounded bg-muted px-1">
                                [Link Text](https://url.com)
                              </code>
                            </p>
                            <p>
                              <code className="rounded bg-muted px-1">
                                - List item
                              </code>
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold">Variables</h4>
                          <div className="mt-2 space-y-2 text-muted-foreground">
                            <p>
                              <code className="rounded bg-muted px-1">
                                {'{{name}}'}
                              </code>{' '}
                              - Recipient&apos;s name
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold">Tips</h4>
                          <ul className="mt-2 list-disc space-y-1 pl-4 text-muted-foreground">
                            <li>Keep emails concise and focused</li>
                            <li>Use a clear call-to-action</li>
                            <li>Personalize with the recipient&apos;s name</li>
                            <li>Test your email before sending</li>
                          </ul>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="preview" className="flex-1">
                    <ScrollArea className="h-[400px] rounded-md border bg-white p-4 dark:bg-gray-950">
                      <div className="text-sm">
                        <div className="mb-4 border-b pb-4">
                          <p className="text-xs text-muted-foreground">
                            Subject:
                          </p>
                          <p className="font-medium">
                            {form.watch('email_subject') || 'No subject'}
                          </p>
                        </div>
                        <div
                          className="prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{
                            __html: previewContent(
                              markdownToHtml(emailContent),
                            ),
                          }}
                        />
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-4">
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
