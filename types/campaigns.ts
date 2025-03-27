export interface Campaign {
  id: string;
  name: string;
  description: string;
  email_subject: string;
  email_template: string;
  status: 'draft' | 'active' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  sent_at?: string | null;
}

export interface CampaignLead {
  id: string;
  campaign_id: string;
  lead_id: string;
  status: 'pending' | 'sent' | 'opened' | 'clicked' | 'bounced' | 'failed';
  created_at: string;
  sent_at?: string | null;
  opened_at?: string | null;
  clicked_at?: string | null;
}
