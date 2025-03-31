import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { Lead } from '@/types/supabase';

export function UploadLeadsModal() {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const queryClient = useQueryClient();
  const supabase = useSupabaseBrowser();

  const { mutate: uploadLeads, isPending: isUploading } = useMutation({
    mutationFn: async (leads: Lead[]) => {
      // Deduplicate leads by email, keeping the most recent submission
      const emailMap = new Map<string, Lead>();

      leads.forEach((lead) => {
        const existingLead = emailMap.get(lead.email);

        // If this email doesn't exist in map yet, or if current lead is more recent, add it
        if (
          !existingLead ||
          (lead.submission_time &&
            existingLead.submission_time &&
            new Date(lead.submission_time) >
              new Date(existingLead.submission_time))
        ) {
          emailMap.set(lead.email, lead);
        }
      });

      // Convert map back to array
      const uniqueLeads = Array.from(emailMap.values());
      console.log('uniqueLeads', uniqueLeads);
      const { error } = await supabase.from('leads').upsert(uniqueLeads, {
        onConflict: 'email',
        ignoreDuplicates: false, // Update existing records
      });
      if (error) throw error;
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const csvText = event.target?.result as string;
      const lines = csvText.split('\n');

      // Find header indexes
      const headers = lines[0].split(',');
      const dateIndex = headers.findIndex((h) =>
        h.trim().toLowerCase().includes('date'),
      );
      const emailIndex = headers.findIndex((h) =>
        h.trim().toLowerCase().includes('email'),
      );
      const idIndex = headers.findIndex((h) =>
        h.trim().toLowerCase().includes('id'),
      );
      const nameIndex = headers.findIndex((h) =>
        h.trim().toLowerCase().includes('name'),
      );

      if (emailIndex === -1) {
        toast({
          title: 'Invalid CSV Format',
          description: 'CSV must contain an Email column.',
          variant: 'destructive',
        });
        return;
      }

      const leads = lines
        .slice(1)
        .filter((line) => line.trim() !== '') // Skip empty lines
        .map((line) => {
          const values = line.split(',');
          const email = values[emailIndex]?.trim() || '';
          const submissionDate =
            values[dateIndex]?.trim() || new Date().toISOString();
          const submissionId = values[idIndex]?.trim() || '';

          // Use name from CSV if available, otherwise extract from email
          let name;
          if (nameIndex !== -1 && values[nameIndex]?.trim()) {
            name = values[nameIndex].trim();
          } else {
            // Extract username from email as fallback
            name = email.split('@')[0] || 'Unknown';
          }

          // Parse submission date, defaulting to current time if invalid
          let parsedSubmissionTime: Date;
          try {
            parsedSubmissionTime = new Date(submissionDate);
            // If the date is invalid, fall back to current time
            if (isNaN(parsedSubmissionTime.getTime())) {
              parsedSubmissionTime = new Date();
            }
          } catch {
            parsedSubmissionTime = new Date();
          }

          return {
            name: name,
            email: email,
            phone: 'Not provided', // Default value
            message: `Imported from CSV. Submission ID: ${submissionId}, Submission Time: ${parsedSubmissionTime.toISOString()}`, // Include parsed time
            submission_time: parsedSubmissionTime.toISOString(),
            group: groupName || null, // Use provided group name or null
          };
        })
        .filter((lead) => lead.email); // Only keep entries with email

      if (leads.length === 0) {
        toast({
          title: 'No valid leads found',
          description: 'The CSV file did not contain any valid lead data.',
          variant: 'destructive',
        });
        return;
      }

      uploadLeads(leads, {
        onSuccess: () => {
          setOpen(false);
          e.target.value = ''; // Reset file input
          queryClient.invalidateQueries({ queryKey: ['leads'] });
          toast({
            title: 'Upload Successful',
            description: `${leads.length} leads have been imported.`,
          });
        },
        onError: (error) => {
          console.error('Upload error:', error);
          toast({
            title: 'Upload Error',
            description: 'Failed to import leads. Please try again.',
            variant: 'destructive',
          });
        },
      });
    };

    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Upload CSV</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Leads from CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="group-name" className="text-sm font-medium">
              Group Name (optional)
            </label>
            <Input
              id="group-name"
              placeholder="Enter a group name for these leads"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <div className="space-y-2 text-sm text-gray-500">
            <p className="font-medium">CSV Format Requirements:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Required column:</strong>
                {' Email (contains &ldquo;email&rdquo; in header)'}
              </li>
              <li>
                <strong>Optional columns:</strong>
                <ul className="list-disc pl-5">
                  <li>
                    Name (contains &ldquo;name&rdquo; in header) - Lead&apos;s
                    full name
                  </li>
                  <li>
                    Date (contains &ldquo;date&rdquo; in header) - When the lead
                    was submitted
                  </li>
                  <li>
                    ID (contains &ldquo;id&rdquo; in header) - A unique
                    identifier for the lead
                  </li>
                </ul>
              </li>
              <li>
                If no name column is found, the system will extract the username
                from the email address
              </li>
              <li>
                If no date is provided or it&apos;s invalid, the current date
                will be used
              </li>
              <li>
                The group name above will be applied to all imported leads
              </li>
            </ul>
            <p className="mt-2">
              Example header row:{' '}
              <code>Name,Email,Submission Date,Submission ID</code>
            </p>
          </div>
          <p className="text-sm text-gray-500">
            {isUploading ? 'Uploading...' : 'Select a CSV file to upload.'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
