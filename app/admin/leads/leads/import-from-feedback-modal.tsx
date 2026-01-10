'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import {
  Download,
  Loader2,
  Mail,
  MessageSquare,
  Calendar,
  Tag,
  CheckCircle2,
} from 'lucide-react';

interface FeedbackEntry {
  id: string;
  email: string;
  name: string;
  message: string;
  feedback_type: string;
  created_at: string;
}

export function ImportFromFeedbackModal() {
  const [open, setOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('feedback');
  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();

  // Fetch feedback entries that aren't already leads
  const { data: feedbackEntries = [], isLoading } = useQuery({
    queryKey: ['feedback-for-import'],
    queryFn: async () => {
      // Get all feedback
      const { data: feedback, error: feedbackError } = await supabase
        .from('feedback')
        .select('id, email, name, message, feedback_type, created_at')
        .order('created_at', { ascending: false });

      if (feedbackError) throw feedbackError;

      // Get existing lead emails
      const { data: existingLeads } = await supabase
        .from('leads')
        .select('email');

      const existingEmails = new Set(
        (existingLeads || []).map((l) => l.email.toLowerCase()),
      );

      // Filter out feedback entries that are already leads
      return (feedback || []).filter(
        (f) => !existingEmails.has(f.email.toLowerCase()),
      ) as FeedbackEntry[];
    },
    enabled: open,
  });

  // Import mutation
  const { mutate: importFeedback, isPending: isImporting } = useMutation({
    mutationFn: async () => {
      const toImport = feedbackEntries.filter((f) =>
        selectedFeedback.includes(f.id),
      );

      if (toImport.length === 0) {
        throw new Error('No feedback selected');
      }

      // Deduplicate by email (keep first occurrence)
      const seenEmails = new Set<string>();
      const uniqueToImport = toImport.filter((f) => {
        const emailLower = f.email.toLowerCase();
        if (seenEmails.has(emailLower)) {
          return false;
        }
        seenEmails.add(emailLower);
        return true;
      });

      // Double-check against existing leads
      const { data: existingLeads } = await supabase
        .from('leads')
        .select('email');

      const existingEmails = new Set(
        (existingLeads || []).map((l) => l.email.toLowerCase()),
      );

      const finalToImport = uniqueToImport.filter(
        (f) => !existingEmails.has(f.email.toLowerCase()),
      );

      if (finalToImport.length === 0) {
        throw new Error('All selected contacts are already imported');
      }

      const now = new Date().toISOString();
      let importedCount = 0;
      const errors: string[] = [];

      // Import one by one to handle any remaining duplicates
      for (const f of finalToImport) {
        const { error } = await (supabase as any).from('leads').insert({
          email: f.email,
          name: f.name,
          message: f.message,
          phone: '',
          group: groupName || null,
          submission_time: f.created_at,
          created_at: now,
        });

        if (error) {
          // Skip duplicates silently
          if (!error.message?.includes('duplicate')) {
            errors.push(`${f.email}: ${error.message}`);
          }
        } else {
          importedCount++;
        }
      }

      if (errors.length > 0 && importedCount === 0) {
        throw new Error(`Failed to import: ${errors[0]}`);
      }

      return importedCount;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['feedback-for-import'] });
      toast({
        title: 'Import Successful',
        description: `Imported ${count} contacts to leads`,
      });
      setOpen(false);
      setSelectedFeedback([]);
    },
    onError: (error) => {
      console.error('Import error:', error);
      toast({
        title: 'Import Failed',
        description:
          error instanceof Error ? error.message : 'Failed to import contacts',
        variant: 'destructive',
      });
    },
  });

  const toggleSelection = (id: string) => {
    setSelectedFeedback((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selectedFeedback.length === feedbackEntries.length) {
      setSelectedFeedback([]);
    } else {
      setSelectedFeedback(feedbackEntries.map((f) => f.id));
    }
  };

  const getFeedbackTypeColor = (type: string) => {
    switch (type) {
      case 'bug':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'feature':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'general':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Import from Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Import Contacts from Feedback
          </DialogTitle>
          <DialogDescription>
            Import email contacts from feedback submissions that aren&apos;t
            already in your leads list.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Group assignment */}
          <div className="flex items-center gap-4">
            <Label htmlFor="group" className="whitespace-nowrap">
              Assign to Group:
            </Label>
            <Input
              id="group"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., feedback, newsletter"
              className="flex-1"
            />
          </div>

          {/* Selection header */}
          {feedbackEntries.length > 0 && (
            <div className="flex items-center justify-between rounded-md bg-muted p-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="selectAll"
                  checked={
                    feedbackEntries.length > 0 &&
                    selectedFeedback.length === feedbackEntries.length
                  }
                  onCheckedChange={toggleAll}
                />
                <label htmlFor="selectAll" className="text-sm font-medium">
                  Select All
                </label>
              </div>
              <span className="text-sm text-muted-foreground">
                {selectedFeedback.length} of {feedbackEntries.length} selected
              </span>
            </div>
          )}

          {/* Feedback list */}
          {isLoading ? (
            <div className="flex h-[200px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : feedbackEntries.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center text-muted-foreground">
              <CheckCircle2 className="mb-2 h-12 w-12 text-green-500" />
              <p>All feedback contacts are already imported!</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] rounded-md border">
              <div className="space-y-2 p-2">
                {feedbackEntries.map((feedback) => (
                  <div
                    key={feedback.id}
                    className={`cursor-pointer rounded-md border p-3 transition-colors ${
                      selectedFeedback.includes(feedback.id)
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => toggleSelection(feedback.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedFeedback.includes(feedback.id)}
                        onCheckedChange={() => toggleSelection(feedback.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{feedback.name}</span>
                          <Badge
                            variant="secondary"
                            className={getFeedbackTypeColor(
                              feedback.feedback_type,
                            )}
                          >
                            {feedback.feedback_type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {feedback.email}
                        </div>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {feedback.message}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(feedback.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => importFeedback()}
              disabled={selectedFeedback.length === 0 || isImporting}
            >
              {isImporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Import{' '}
              {selectedFeedback.length > 0 && `(${selectedFeedback.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
