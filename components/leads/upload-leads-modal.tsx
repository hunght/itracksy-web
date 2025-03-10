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

export function UploadLeadsModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const supabase = useSupabaseBrowser();

  const { mutate: uploadLeads, isPending: isUploading } = useMutation({
    mutationFn: async (leads: any[]) => {
      const { error } = await supabase.from('leads').insert(leads);
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

          // Extract username from email to use as name
          const name = email.split('@')[0] || 'Unknown';

          return {
            name: name,
            email: email,
            phone: 'Not provided', // Default value
            message: `Imported from CSV. Submission ID: ${submissionId}, Date: ${submissionDate}`, // Default with metadata
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
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <p className="text-sm text-gray-500">
            Your CSV should include at least an Email column. Submission Date
            and Submission ID are optional.
          </p>
          <p className="text-sm text-gray-500">
            {isUploading ? 'Uploading...' : 'Select a CSV file to upload.'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
