import { createAdminClient, TypedSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import React from 'react';

import { Campaign } from '@/types/campaigns';

import { EMAIL_TEMPLATES, TemplateType } from '@/config/email_campaigns';

// Simple markdown to HTML converter
function markdownToHtml(markdown: string): string {
  let html = markdown
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(
      /^### (.*$)/gm,
      '<h3 style="font-size: 18px; font-weight: 600; margin-top: 16px; margin-bottom: 8px;">$1</h3>',
    )
    .replace(
      /^## (.*$)/gm,
      '<h2 style="font-size: 20px; font-weight: 600; margin-top: 16px; margin-bottom: 8px;">$1</h2>',
    )
    .replace(
      /^# (.*$)/gm,
      '<h1 style="font-size: 24px; font-weight: 700; margin-top: 16px; margin-bottom: 8px;">$1</h1>',
    )
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Images (must come before links)
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;" />',
    )
    // Links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" style="color: #f59e0b; text-decoration: underline;">$1</a>',
    )
    // Unordered lists
    .replace(/^\s*[-*]\s+(.*$)/gm, '<li style="margin-left: 16px;">$1</li>')
    // Line breaks (double newline = paragraph)
    .replace(/\n\n/g, '</p><p style="margin: 8px 0;">')
    // Single line breaks
    .replace(/\n/g, '<br />');

  // Wrap in paragraph tags
  html = '<p style="margin: 8px 0;">' + html + '</p>';

  // Clean up empty paragraphs
  html = html.replace(/<p style="margin: 8px 0;"><\/p>/g, '');

  // Wrap consecutive list items in ul
  html = html.replace(
    /(<li[^>]*>.*?<\/li>)+/g,
    '<ul style="list-style-type: disc; margin: 8px 0; padding-left: 20px;">$&</ul>',
  );

  return html;
}

// Generate HTML email wrapper
function generateEmailHtml(content: string, recipientName: string): string {
  // Replace {{name}} with recipient name
  const personalizedContent = content.replace(/\{\{name\}\}/g, recipientName);
  const htmlContent = markdownToHtml(personalizedContent);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${htmlContent}
  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
  <p style="font-size: 12px; color: #666;">
    Sent by <a href="https://itracksy.com" style="color: #f59e0b;">iTracksy</a>
  </p>
</body>
</html>`;
}

type CampaignLeadWithLead = {
  id: string;
  campaign_id: string;
  lead_id: string;
  status: string;
  sent_at: string | null;
  lead: {
    id: string;
    name: string | null;
    email: string;
    created_at: string;
    submission_time: string | null;
  } | null;
};

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
    // Validate Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 },
      );
    }

    // Initialize Supabase client
    const supabase = await createAdminClient();

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

    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active campaigns to process',
      });
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
    const { data: campaignLeads, error: leadsError } = (await supabase
      .from('campaign_leads')
      .select(`*,lead:leads(id, name, email, created_at, submission_time)`)
      .eq('campaign_id', campaign.id)
      .eq('status', 'pending')
      .filter('lead.submission_time', 'not.is', null)) as unknown as {
      data: CampaignLeadWithLead[] | null;
      error: Error | null;
    };

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

        // Validate email address
        if (!campaignLead.lead.email) {
          console.error(
            `Missing email address for lead ${campaignLead.lead.id}`,
          );
          continue;
        }

        let emailData;
        let emailError;
        const recipientName = campaignLead.lead.name || 'there';
        const recipientEmail = isDevelopment
          ? DEV_EMAIL
          : campaignLead.lead.email;
        const emailSubject = isDevelopment
          ? `[TEST] ${campaign.email_subject}`
          : campaign.email_subject;

        // Handle markdown template type
        if (campaign.email_template === 'markdown' && campaign.email_content) {
          const htmlEmail = generateEmailHtml(
            campaign.email_content,
            recipientName,
          );

          const result = await resend.emails.send({
            from: 'iTracksy <noreply@itracksy.com>',
            to: recipientEmail,
            subject: emailSubject,
            html: htmlEmail,
            tags: [
              { name: 'lead_id', value: String(campaignLead.lead.id) },
              { name: 'campaign_id', value: String(campaign.id) },
            ],
          });
          emailData = result.data;
          emailError = result.error;
        } else {
          // Validate predefined email template exists
          const emailTemplate = campaign.email_template as TemplateType;
          if (!emailTemplate || !EMAIL_TEMPLATES[emailTemplate]) {
            console.error(
              `Invalid email template "${emailTemplate}" for campaign ${campaign.id}`,
            );
            continue;
          }

          // Get the email template component
          const EmailTemplate = EMAIL_TEMPLATES[emailTemplate];
          if (typeof EmailTemplate !== 'function') {
            console.error(
              `Email template "${emailTemplate}" is not a valid function`,
            );
            continue;
          }

          // Send email using Resend with React template
          const emailElement = EmailTemplate({ name: recipientName });
          const result = await resend.emails.send({
            from: 'iTracksy <noreply@itracksy.com>',
            to: recipientEmail,
            subject: emailSubject,
            react: emailElement as React.ReactElement,
            tags: [
              { name: 'lead_id', value: String(campaignLead.lead.id) },
              { name: 'campaign_id', value: String(campaign.id) },
            ],
          });
          emailData = result.data;
          emailError = result.error;
        }

        if (emailError) {
          console.error('Error sending email:', emailError);
          continue;
        }

        // Update campaign lead status
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('marketing_campaigns')
        .update({
          status: 'completed',
          sent_at: new Date().toISOString(),
        })
        .eq('id', campaign.id);
    }
  }
}
