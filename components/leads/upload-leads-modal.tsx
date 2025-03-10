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
      const headers = lines[0].split(',');

      const leads = lines
        .slice(1)
        .map((line) => {
          const values = line.split(',');
          return {
            name: values[0],
            email: values[1],
            phone: values[2],
            message: values[3],
          };
        })
        .filter((lead) => lead.name && lead.email);

      uploadLeads(leads, {
        onSuccess: () => {
          setOpen(false);
          queryClient.invalidateQueries({ queryKey: ['leads'] });
          toast({
            title: 'Upload Successful',
            description: `${leads.length} leads have been imported.`,
          });
        },
        onError: (error) => {
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
            CSV should have columns: name, email, phone, message
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
