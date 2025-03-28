import { createSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Initialize Supabase client
    const supabase = createSupabaseClient();

    // Get all pending campaigns
    const { data: campaigns, error: campaignsError } = await supabase
      .from('marketing_campaigns')
      .select('*')
      .eq('status', 'draft');

    if (campaignsError) {
      console.error('Error fetching campaigns:', campaignsError);
      return NextResponse.json(
        { error: 'Failed to fetch campaigns' },
        { status: 500 },
      );
    }

    for (const campaign of campaigns) {
      // Get all pending leads for this campaign
      const { data: campaignLeads, error: leadsError } = await supabase
        .from('campaign_leads')
        .select(
          `
          *,
          leads (
            email,

          )
        `,
        )
        .eq('campaign_id', campaign.id)
        .eq('status', 'pending')
        .limit(10); // Process in batches to avoid overwhelming

      if (leadsError) {
        console.error('Error fetching campaign leads:', leadsError);
        continue;
      }

      for (const campaignLead of campaignLeads) {
        try {
          // Send email using Resend
          const { data: emailData, error: emailError } =
            await resend.emails.send({
              from: 'ITrackSy <noreply@itracksy.com>',
              to: campaignLead.leads?.email,
              subject: campaign.email_subject,
              html: campaign.email_template.replace(
                /\{\{name\}\}/g,
                `${campaignLead.leads.first_name} ${campaignLead.leads.last_name}`,
              ),
            });

          if (emailError) {
            console.error('Error sending email:', emailError);
            continue;
          }

          // Update campaign lead status
          const { error: updateError } = await supabase
            .from('campaign_leads')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
            })
            .eq('id', campaignLead.id);

          if (updateError) {
            console.error('Error updating campaign lead:', updateError);
          }

          // Add a small delay between emails to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.error('Error processing campaign lead:', error);
        }
      }

      // Update campaign status if all leads are processed
      const { count } = await supabase
        .from('campaign_leads')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', campaign.id)
        .eq('status', 'pending');

      if (count === 0) {
        await supabase
          .from('marketing_campaigns')
          .update({
            status: 'completed',
            sent_at: new Date().toISOString(),
          })
          .eq('id', campaign.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in send-campaign endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
