import { createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Define the structure of Resend webhook events
type ResendWebhookEvent = {
  type:
    | 'email.sent'
    | 'email.delivered'
    | 'email.delivery_delayed'
    | 'email.complained'
    | 'email.bounced'
    | 'email.opened'
    | 'email.clicked';
  created_at?: string;
  data: {
    email_id: string;
    created_at: string;
    to: string[];
    from: string;
    subject: string;
    tags?: Record<string, string> | { name: string; value: string }[];
    // For click events
    click?: {
      user_agent?: string;
      ip?: string;
      url?: string;
    };
  };
};

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (in production, you should verify the signature)
    // const signature = request.headers.get('resend-signature');
    // if (!signature) {
    //   return NextResponse.json({ error: 'No signature provided' }, { status: 401 });
    // }

    // Parse the webhook payload
    const payload = (await request.json()) as ResendWebhookEvent;
    const { type, data } = payload;

    // Log the raw payload for debugging
    console.log(
      'Received Resend webhook payload:',
      JSON.stringify(payload, null, 2),
    );

    // Initialize Supabase client
    const supabase = await createAdminClient();

    // Extract the recipient email (first in the to array)
    const recipientEmail = data.to[0];

    // Extract event type from the webhook type
    const eventType = type.replace('email.', '');

    // Convert tags to a usable object, handling both array and object formats
    let tagsObject: Record<string, string> = {};

    if (data.tags) {
      if (Array.isArray(data.tags)) {
        // Handle array format (old format)
        data.tags.forEach((tag) => {
          tagsObject[(tag as any).name] = (tag as any).value;
        });
      } else {
        // Handle object format (new format)
        tagsObject = data.tags as Record<string, string>;
      }
    }

    // Extract campaign_id from tags if available
    let campaignId = tagsObject.campaign_id;

    if (!campaignId) {
      // find the current active campaign
      const { data: activeCampaigns, error: activeCampaignError } =
        (await supabase
          .from('marketing_campaigns')
          .select('id')
          .eq('status', 'active')
          .single()) as unknown as { data: { id: string } | null; error: Error | null };
      if (activeCampaignError || !activeCampaigns) {
        // Log the error and return a 404 response
        // throw error if no active campaign is found
        console.error('Error fetching active campaign:', activeCampaignError);
        return NextResponse.json({ error: tagsObject }, { status: 404 });
      }

      campaignId = activeCampaigns.id;
    }

    // Create metadata object based on event type
    let metadata: Record<string, any> = {
      ...tagsObject,
      timestamp: new Date().toISOString(),
    };

    if (type === 'email.clicked' && data.click) {
      metadata = {
        ...metadata,
        ...data.click,
      };
    }

    // If this is related to a campaign (has campaign_id tag)
    type CampaignLeadResult = { id: string; campaign_id: string; lead_id: string; sent_at: string | null };

    if (campaignId) {
      const leadId = tagsObject.lead_id;
      let campaignLeadsQuery;

      // Find the campaign_lead entry using lead_id if available, or email otherwise
      if (leadId) {
        // Query using lead_id directly
        campaignLeadsQuery = (await supabase
          .from('campaign_leads')
          .select('id, campaign_id, lead_id, sent_at')
          .eq('campaign_id', campaignId)
          .eq('lead_id', leadId)
          .single()) as unknown as { data: CampaignLeadResult | null; error: Error | null };
      } else {
        // Fallback to using email lookup
        campaignLeadsQuery = (await supabase
          .from('campaign_leads')
          .select('id, campaign_id, lead_id, sent_at')
          .eq('campaign_id', campaignId)
          .eq('lead:leads(email)', recipientEmail)
          .single()) as unknown as { data: CampaignLeadResult | null; error: Error | null };
      }

      const { data: campaignLeads, error: findError } = campaignLeadsQuery;

      if (findError) {
        console.error('Error finding campaign lead:', findError);
      } else if (campaignLeads) {
        // Update the campaign_leads table based on the event type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const supabaseAny = supabase as any;
        switch (type) {
          case 'email.sent':
          case 'email.delivered':
            if (!campaignLeads.sent_at) {
              const { error: sentError } = await supabaseAny
                .from('campaign_leads')
                .update({
                  status: 'sent',
                  sent_at: new Date().toISOString(),
                })
                .eq('id', campaignLeads.id);

              if (sentError) {
                console.error('Error updating sent_at:', sentError);
              }
            }
            break;

          case 'email.opened':
            const { error: openedError } = await supabaseAny
              .from('campaign_leads')
              .update({ opened_at: new Date().toISOString() })
              .eq('id', campaignLeads.id)
              .is('opened_at', null);

            if (openedError) {
              console.error('Error updating opened_at:', openedError);
            }
            break;

          case 'email.clicked':
            const { error: clickedError } = await supabaseAny
              .from('campaign_leads')
              .update({ clicked_at: new Date().toISOString() })
              .eq('id', campaignLeads.id)
              .is('clicked_at', null);

            if (clickedError) {
              console.error('Error updating clicked_at:', clickedError);
            }
            break;

          case 'email.bounced':
            const { error: bouncedError } = await supabaseAny
              .from('campaign_leads')
              .update({ status: 'bounced' })
              .eq('id', campaignLeads.id);

            if (bouncedError) {
              console.error('Error updating bounce status:', bouncedError);
            }
            break;
        }
      }
    }

    // Log the event for debugging
    console.log(
      `Email event: ${type} for ${recipientEmail} (Campaign ID: ${campaignId || 'N/A'})`,
    );

    // Return a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
