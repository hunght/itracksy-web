import { createSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { NewsletterEmail } from '@/emails/NewsletterEmail';

// Import other email templates

const resend = new Resend(process.env.RESEND_API_KEY);
const BATCH_SIZE = 10; // Process 10 leads at a time
const DELAY_BETWEEN_EMAILS = 1000; // 1 second delay between emails
const TIME_WINDOW_MINUTES = 90; // Send emails within 90 minutes of submission_time as the cron job run every hour

const EMAIL_TEMPLATES = {
  welcome: WelcomeEmail,
  newsletter: NewsletterEmail,
} as const;

type TemplateType = keyof typeof EMAIL_TEMPLATES;

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
          const timeDiff = Math.abs(now.getTime() - submissionTime.getTime());
          const minutesDiff = timeDiff / (1000 * 60); // Convert to minutes

          return minutesDiff <= TIME_WINDOW_MINUTES;
        })
        .slice(0, BATCH_SIZE);

      for (const campaignLead of leadsToProcess || []) {
        try {
          if (!campaignLead.lead) {
            continue;
          }

          // Send email using Resend
          const { data: emailData, error: emailError } =
            await resend.emails.send({
              from: 'ITrackSy <noreply@itracksy.com>',
              to: campaignLead.lead.email,
              subject: campaign.email_subject,
              react: EMAIL_TEMPLATES[campaign.email_template as TemplateType]({
                name: campaignLead.lead.name,
              }),
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

          // Add a delay between emails to avoid rate limiting
          await new Promise((resolve) =>
            setTimeout(resolve, DELAY_BETWEEN_EMAILS),
          );
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
