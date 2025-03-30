import { Database } from '@/lib/supabase';

export type Campaign =
  Database['public']['Tables']['marketing_campaigns']['Row'];
export type CampaignLead =
  Database['public']['Tables']['campaign_leads']['Insert'];
