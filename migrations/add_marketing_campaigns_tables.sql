-- Create marketing_campaigns table
CREATE TABLE public.marketing_campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  email_subject TEXT NOT NULL,
  email_template TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Create campaign_leads junction table
CREATE TABLE public.campaign_leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(campaign_id, lead_id)
);

-- Add indexes for better performance
CREATE INDEX idx_campaign_leads_campaign_id ON public.campaign_leads(campaign_id);
CREATE INDEX idx_campaign_leads_lead_id ON public.campaign_leads(lead_id);
CREATE INDEX idx_marketing_campaigns_status ON public.marketing_campaigns(status);

-- Set up RLS policies
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_leads ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to select data
CREATE POLICY select_marketing_campaigns ON public.marketing_campaigns
  FOR SELECT TO authenticated USING (true);

CREATE POLICY select_campaign_leads ON public.campaign_leads
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert/update data
CREATE POLICY insert_marketing_campaigns ON public.marketing_campaigns
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY update_marketing_campaigns ON public.marketing_campaigns
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY insert_campaign_leads ON public.campaign_leads
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY update_campaign_leads ON public.campaign_leads
  FOR UPDATE TO authenticated USING (true);
