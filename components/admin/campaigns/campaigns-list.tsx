'use client';

import { useQuery } from '@tanstack/react-query';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { Campaign } from '@/types/campaigns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CampaignsListProps {
  onSelect: (campaign: Campaign) => void;
  selectedCampaignId?: string;
}

export function CampaignsList({
  onSelect,
  selectedCampaignId,
}: CampaignsListProps) {
  const supabase = useSupabaseBrowser();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Campaign[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!campaigns?.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No campaigns found. Create your first campaign to get started.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="mb-4 font-medium">Your Campaigns</h3>
      <ScrollArea className="h-[400px] pr-3">
        <div className="space-y-2">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className={cn(
                'cursor-pointer rounded-md border p-3 transition-colors',
                selectedCampaignId === campaign.id
                  ? 'border-primary/20 bg-primary/5'
                  : 'hover:bg-muted',
              )}
              onClick={() => onSelect(campaign)}
            >
              <div className="flex items-start justify-between">
                <h4 className="font-medium">{campaign.name}</h4>
                <Badge variant={getBadgeVariant(campaign.status)}>
                  {formatStatus(campaign.status)}
                </Badge>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {campaign.description}
              </p>
              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                <CalendarIcon className="mr-1 h-3 w-3" />
                {new Date(campaign.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getBadgeVariant(
  status: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'active':
      return 'default';
    case 'draft':
      return 'secondary';
    case 'completed':
      return 'outline';
    case 'failed':
      return 'destructive';
    default:
      return 'secondary';
  }
}
