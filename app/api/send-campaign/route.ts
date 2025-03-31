import { createAdminClient, TypedSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { Campaign } from '@/types/campaigns';

import { EMAIL_TEMPLATES, TemplateType } from '@/config/email_campaigns';

// Import other email templates

const resend = new Resend(process.env.RESEND_API_KEY);
const BATCH_SIZE = 10; // Process 10 leads at a time
const DELAY_BETWEEN_EMAILS = 1000; // 1 second delay between emails
const TIME_WINDOW_MINUTES = 20; // Send emails within 20 minutes of submission_time as the cron job run every 15 minutes

// Add development check constant
const isDevelopment = process.env.NODE_ENV === 'development';
const DEV_EMAIL = 'hth321@gmail.com';

export async function POST(request: Request) {
  try {
    // Initialize Supabase client
    const supabase = createAdminClient();

    // Get all pending campaigns
    const { data: campaigns, error: campaignsError } = await supabase
      .from('marketing_campaigns')
      .select('*')
      .eq('status', 'active');

    if (campaignsError) {
      console.error('Error fetching campaigns:', campaignsError);
      return NextResponse.json(
        { error: 'Failed to fetch campaigns' },
        { status: 500 },
      );
    }

    // Process the campaigns and await the result
    // This ensures the function doesn't terminate prematurely
    await processCampaignsInBackground(campaigns, supabase);

    // Return success after processing is complete
    return NextResponse.json({
      success: true,
      message: 'Campaign processing completed successfully',
    });
  } catch (error) {
    console.error('Error in send-campaign endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// Background processing function to handle emails without blocking the API response
async function processCampaignsInBackground(
  campaigns: Campaign[],
  supabase: TypedSupabaseClient,
) {
  console.log(`Number of campaigns to process: ${campaigns.length}`);

  for (const campaign of campaigns) {
    // Get pending leads that are within the time window of their submission_time
    const now = new Date();
    const { data: campaignLeads, error: leadsError } = await supabase
      .from('campaign_leads')
      .select(`*,lead:leads(id, name, email, created_at, submission_time)`)
      .eq('campaign_id', campaign.id)
      .eq('status', 'pending')
      .filter('lead.submission_time', 'not.is', null);

    if (leadsError) {
      console.error('Error fetching campaign leads:', leadsError);
      continue;
    }

    // Filter leads that are within the time window
    const leadsToProcess = campaignLeads
      ?.filter((campaignLead) => {
        if (!campaignLead.lead?.submission_time) return false;

        const submissionTime = new Date(campaignLead.lead.submission_time);

        // Calculate time difference considering only hours, minutes, and seconds
        const nowTimeInMinutes = now.getHours() * 60 + now.getMinutes();
        const submissionTimeInMinutes =
          submissionTime.getHours() * 60 + submissionTime.getMinutes();

        // Calculate difference in minutes, accounting for time wraparound (24-hour cycle)
        let timeDiffMinutes = Math.abs(
          nowTimeInMinutes - submissionTimeInMinutes,
        );

        // Handle cases where times cross midnight
        if (timeDiffMinutes > 12 * 60) {
          timeDiffMinutes = 24 * 60 - timeDiffMinutes;
        }

        console.log(
          `Time difference for lead ${campaignLead.lead.id}: ${timeDiffMinutes} minutes`,
        );
        return timeDiffMinutes <= TIME_WINDOW_MINUTES;
      })
      .slice(0, BATCH_SIZE);

    console.log(
      `Number of leads to process for campaign ${campaign.id}: ${leadsToProcess?.length} leads campaignLeads ${campaignLeads?.length}`,
    );

    // Process each lead
    for (const campaignLead of leadsToProcess || []) {
      try {
        if (!campaignLead.lead) {
          continue;
        }

        // Send email using Resend
        const { data: emailData, error: emailError } = await resend.emails.send(
          {
            from: 'ITrackSy <noreply@itracksy.com>',
            to: isDevelopment ? DEV_EMAIL : campaignLead.lead.email,
            subject: isDevelopment
              ? `[TEST] ${campaign.email_subject}`
              : campaign.email_subject,
            react: EMAIL_TEMPLATES[campaign.email_template as TemplateType]({
              name: campaignLead.lead.name,
            }),
            tags: [
              { name: 'lead_id', value: campaignLead.lead.id },
              { name: 'campaign_id', value: campaign.id },
            ],
          },
        );

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

        // Add a delay between emails to avoid rate limiting
        await new Promise((resolve) =>
          setTimeout(resolve, DELAY_BETWEEN_EMAILS),
        );
      } catch (error) {
        console.error('Error processing campaign lead:', error);
      }
      if (isDevelopment) {
        console.log('In development mode, stop after processing one lead');
        break;
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
}
