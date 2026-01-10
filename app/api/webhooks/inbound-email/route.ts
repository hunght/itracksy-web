import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role for webhook (no user auth)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY!,
);

// Resend inbound email webhook payload type
interface ResendInboundEmail {
  type: 'email.received';
  created_at: string;
  data: {
    email_id: string;
    to: string[];
    from: string;
    subject: string;
    message_id?: string;
    created_at: string;
    // These may or may not be present in webhook
    text?: string;
    html?: string;
    headers?: {
      'message-id'?: string;
      'in-reply-to'?: string;
      references?: string;
    };
  };
}

// Full email response from Resend API
interface ResendEmailDetails {
  id: string;
  from: string;
  to: string[];
  subject: string;
  text?: string;
  html?: string;
  created_at: string;
  headers?: Record<string, string>;
}

// Extract email and name from "Name <email@example.com>" format
function parseEmailAddress(address: string): { email: string; name: string } {
  const match = address.match(/^(?:"?([^"]*)"?\s)?<?([^>]+)>?$/);
  if (match) {
    return {
      name: match[1]?.trim() || '',
      email: match[2]?.trim() || address,
    };
  }
  return { email: address, name: '' };
}

// Try to find matching feedback by email
async function findFeedbackByEmail(
  email: string,
): Promise<{ id: string } | null> {
  const { data, error } = await supabase
    .from('feedback')
    .select('id')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

// Try to find lead by email
async function findLeadByEmail(email: string): Promise<{ id: string } | null> {
  const { data, error } = await supabase
    .from('leads')
    .select('id')
    .eq('email', email)
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

// Try to find campaign from lead's campaign_leads
async function findCampaignFromLead(
  leadId: string,
): Promise<{ campaign_id: string } | null> {
  // Get the most recent campaign this lead was part of
  const { data, error } = await supabase
    .from('campaign_leads')
    .select('campaign_id')
    .eq('lead_id', leadId)
    .eq('status', 'sent')
    .order('sent_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

// Try to find feedback/campaign from previous email thread
async function findContextFromThread(
  inReplyTo: string | undefined,
  references: string | undefined,
): Promise<{
  feedbackId: string | null;
  campaignId: string | null;
  leadId: string | null;
}> {
  const result = {
    feedbackId: null as string | null,
    campaignId: null as string | null,
    leadId: null as string | null,
  };

  if (!inReplyTo && !references) return result;

  // Try in_reply_to first
  if (inReplyTo) {
    const { data } = await supabase
      .from('email_threads')
      .select('feedback_id, campaign_id, lead_id')
      .eq('message_id', inReplyTo)
      .limit(1)
      .single();

    if (data) {
      result.feedbackId = data.feedback_id;
      result.campaignId = data.campaign_id;
      result.leadId = data.lead_id;
      return result;
    }
  }

  // Then try references (space-separated list of message IDs)
  if (references) {
    const refIds = references.split(/\s+/).filter(Boolean);
    for (const refId of refIds) {
      const { data } = await supabase
        .from('email_threads')
        .select('feedback_id, campaign_id, lead_id')
        .eq('message_id', refId)
        .limit(1)
        .single();

      if (data && (data.feedback_id || data.campaign_id || data.lead_id)) {
        result.feedbackId = data.feedback_id;
        result.campaignId = data.campaign_id;
        result.leadId = data.lead_id;
        return result;
      }
    }
  }

  return result;
}

export async function POST(request: Request) {
  try {
    const payload: ResendInboundEmail = await request.json();

    console.log(
      '[Inbound Email] Received webhook:',
      JSON.stringify(payload, null, 2),
    );

    // Only process email.received events
    if (payload.type !== 'email.received') {
      return NextResponse.json({ message: 'Event type ignored' });
    }

    const webhookData = payload.data;
    let emailText = webhookData.text;
    let emailHtml = webhookData.html;
    let headers = webhookData.headers || {};

    // Fetch full email content from Resend Receiving API
    if (webhookData.email_id) {
      console.log(
        '[Inbound Email] Fetching email content for:',
        webhookData.email_id,
      );
      try {
        const response = await fetch(
          `https://api.resend.com/emails/receiving/${webhookData.email_id}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
          },
        );

        if (response.ok) {
          const emailDetails: ResendEmailDetails = await response.json();
          console.log(
            '[Inbound Email] Fetched email content:',
            JSON.stringify(emailDetails, null, 2),
          );
          emailText = emailDetails.text || emailText;
          emailHtml = emailDetails.html || emailHtml;
          if (emailDetails.headers) {
            headers = {
              ...headers,
              ...emailDetails.headers,
            };
          }
        } else {
          console.error(
            '[Inbound Email] Failed to fetch email content:',
            response.status,
            await response.text(),
          );
        }
      } catch (fetchError) {
        console.error(
          '[Inbound Email] Error fetching email content:',
          fetchError,
        );
      }
    }

    // Parse sender info
    const sender = parseEmailAddress(webhookData.from);

    // Initialize context variables
    let feedbackId: string | null = null;
    let campaignId: string | null = null;
    let leadId: string | null = null;

    // 1. First, try to find context from email thread (in-reply-to or references)
    const threadContext = await findContextFromThread(
      headers['in-reply-to'],
      headers.references,
    );
    feedbackId = threadContext.feedbackId;
    campaignId = threadContext.campaignId;
    leadId = threadContext.leadId;

    // 2. If no context found, try to find by sender email
    if (!feedbackId && !campaignId && !leadId) {
      // Try to find lead first (for campaign context)
      const lead = await findLeadByEmail(sender.email);
      if (lead) {
        leadId = lead.id;
        // Try to find campaign this lead was part of
        const campaign = await findCampaignFromLead(lead.id);
        if (campaign) {
          campaignId = campaign.campaign_id;
        }
      }

      // Try to find feedback by email
      const feedback = await findFeedbackByEmail(sender.email);
      if (feedback) {
        feedbackId = feedback.id;
      }
    }

    // Store the email in database
    const { error } = await supabase.from('email_threads').insert({
      message_id:
        webhookData.message_id || headers['message-id'] || webhookData.email_id,
      from_email: sender.email,
      from_name: sender.name,
      to_email: webhookData.to[0] || 'support@itracksy.com',
      subject: webhookData.subject,
      body_text: emailText || '',
      body_html: emailHtml || '',
      in_reply_to: headers['in-reply-to'] || null,
      references: headers.references || null,
      feedback_id: feedbackId,
      campaign_id: campaignId,
      lead_id: leadId,
      direction: 'inbound',
      is_read: false,
      received_at: webhookData.created_at,
    });

    if (error) {
      console.error('Error storing inbound email:', error);
      return NextResponse.json(
        { error: 'Failed to store email' },
        { status: 500 },
      );
    }

    console.log('[Inbound Email] Stored email from:', sender.email, {
      subject: webhookData.subject,
      feedbackId,
      campaignId,
      leadId,
      hasText: !!emailText,
      hasHtml: !!emailHtml,
    });

    return NextResponse.json({ success: true, feedbackId, campaignId, leadId });
  } catch (error) {
    console.error('Inbound email webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// Resend may send GET request to verify endpoint
export async function GET() {
  return NextResponse.json({ status: 'Inbound email webhook active' });
}
