'use client';

import { useQuery } from '@tanstack/react-query';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { Campaign } from '@/types/campaigns';
import { cn } from '@/lib/utils';
import {
  CalendarIcon,
  Loader2,
  Users,
  Mail,
  MessageCircle,
  Eye,
  MousePointer,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

interface CampaignWithStats extends Campaign {
  leads_count?: number;
  sent_count?: number;
  opened_count?: number;
  clicked_count?: number;
  replies_count?: number;
}

interface CampaignsListProps {
  onSelect?: (campaign: Campaign) => void;
  selectedCampaignId?: string;
  showAsCards?: boolean;
}

export function CampaignsList({
  onSelect,
  selectedCampaignId,
  showAsCards = false,
}: CampaignsListProps) {
  const supabase = useSupabaseBrowser();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns-with-stats'],
    queryFn: async () => {
      // Get campaigns
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (campaignsError) throw campaignsError;

      // Get stats for each campaign
      const campaignsWithStats: CampaignWithStats[] = await Promise.all(
        (campaignsData || []).map(async (campaign) => {
          // Get leads count and stats
          const { data: leadsData } = await (supabase as any)
            .from('campaign_leads')
            .select('status, sent_at, opened_at, clicked_at')
            .eq('campaign_id', campaign.id);

          // Get replies count
          const { count: repliesCount } = await (supabase as any)
            .from('email_threads')
            .select('*', { count: 'exact', head: true })
            .eq('campaign_id', campaign.id)
            .eq('direction', 'inbound');

          const leads = leadsData || [];
          return {
            ...campaign,
            leads_count: leads.length,
            sent_count: leads.filter((l: any) => l.sent_at).length,
            opened_count: leads.filter((l: any) => l.opened_at).length,
            clicked_count: leads.filter((l: any) => l.clicked_at).length,
            replies_count: repliesCount || 0,
          };
        }),
      );

      return campaignsWithStats;
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

  if (showAsCards) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="mb-4 font-medium">Your Campaigns</h3>
      <ScrollArea className="h-[500px] pr-3">
        <div className="space-y-2">
          {campaigns.map((campaign) => (
            <CampaignListItem
              key={campaign.id}
              campaign={campaign}
              isSelected={selectedCampaignId === campaign.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function CampaignCard({ campaign }: { campaign: CampaignWithStats }) {
  return (
    <Link
      href={`/admin/marketing-campaigns/${campaign.id}`}
      className="block rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold">{campaign.name}</h4>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {campaign.description}
          </p>
        </div>
        <Badge variant={getBadgeVariant(campaign.status)} className="ml-2">
          {formatStatus(campaign.status)}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        <div className="rounded-md bg-muted/50 p-2">
          <Users className="mx-auto h-4 w-4 text-muted-foreground" />
          <p className="mt-1 text-lg font-semibold">{campaign.leads_count}</p>
          <p className="text-xs text-muted-foreground">Leads</p>
        </div>
        <div className="rounded-md bg-muted/50 p-2">
          <Mail className="mx-auto h-4 w-4 text-blue-500" />
          <p className="mt-1 text-lg font-semibold">{campaign.sent_count}</p>
          <p className="text-xs text-muted-foreground">Sent</p>
        </div>
        <div className="rounded-md bg-muted/50 p-2">
          <Eye className="mx-auto h-4 w-4 text-green-500" />
          <p className="mt-1 text-lg font-semibold">{campaign.opened_count}</p>
          <p className="text-xs text-muted-foreground">Opened</p>
        </div>
        <div className="rounded-md bg-muted/50 p-2">
          <MessageCircle className="mx-auto h-4 w-4 text-purple-500" />
          <p className="mt-1 text-lg font-semibold">{campaign.replies_count}</p>
          <p className="text-xs text-muted-foreground">Replies</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center">
          <CalendarIcon className="mr-1 h-3 w-3" />
          {new Date(campaign.created_at).toLocaleDateString()}
        </div>
        <div className="flex items-center text-primary">
          View Details
          <ChevronRight className="ml-1 h-3 w-3" />
        </div>
      </div>
    </Link>
  );
}

function CampaignListItem({
  campaign,
  isSelected,
  onSelect,
}: {
  campaign: CampaignWithStats;
  isSelected?: boolean;
  onSelect?: (campaign: Campaign) => void;
}) {
  const content = (
    <div
      className={cn(
        'cursor-pointer rounded-md border p-3 transition-colors',
        isSelected ? 'border-primary/20 bg-primary/5' : 'hover:bg-muted',
      )}
      onClick={() => onSelect?.(campaign)}
    >
      <div className="flex items-start justify-between">
        <h4 className="font-medium">{campaign.name}</h4>
        <Badge variant={getBadgeVariant(campaign.status)}>
          {formatStatus(campaign.status)}
        </Badge>
      </div>
      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
        {campaign.description}
      </p>

      {/* Stats row */}
      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {campaign.leads_count}
        </span>
        <span className="flex items-center gap-1">
          <Mail className="h-3 w-3 text-blue-500" />
          {campaign.sent_count}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-green-500" />
          {campaign.opened_count}
        </span>
        {(campaign.replies_count ?? 0) > 0 && (
          <span className="flex items-center gap-1 text-purple-500">
            <MessageCircle className="h-3 w-3" />
            {campaign.replies_count}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center">
          <CalendarIcon className="mr-1 h-3 w-3" />
          {new Date(campaign.created_at).toLocaleDateString()}
        </div>
        <ChevronRight className="h-4 w-4" />
      </div>
    </div>
  );

  if (onSelect) {
    return content;
  }

  return (
    <Link href={`/admin/marketing-campaigns/${campaign.id}`}>{content}</Link>
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
