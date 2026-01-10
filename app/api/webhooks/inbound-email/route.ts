import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Use service role for webhook (no user auth)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY!,
);

const resend = new Resend(process.env.RESEND_API_KEY);

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

// Try to find feedback from previous email thread
async function findFeedbackFromThread(
  inReplyTo: string | undefined,
  references: string | undefined,
): Promise<{ id: string } | null> {
  if (!inReplyTo && !references) return null;

  // First try in_reply_to
  if (inReplyTo) {
    const { data } = await supabase
      .from('email_threads')
      .select('feedback_id')
      .eq('message_id', inReplyTo)
      .limit(1)
      .single();

    if (data?.feedback_id) {
      return { id: data.feedback_id };
    }
  }

  // Then try references (space-separated list of message IDs)
  if (references) {
    const refIds = references.split(/\s+/).filter(Boolean);
    for (const refId of refIds) {
      const { data } = await supabase
        .from('email_threads')
        .select('feedback_id')
        .eq('message_id', refId)
        .limit(1)
        .single();

      if (data?.feedback_id) {
        return { id: data.feedback_id };
      }
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    // Verify webhook signature (optional but recommended)
    // const signature = request.headers.get('resend-signature');
    // TODO: Verify signature with webhook secret

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

    // If text/html not in webhook, fetch from Resend API
    if (!emailText && !emailHtml && webhookData.email_id) {
      console.log(
        '[Inbound Email] Fetching email details for:',
        webhookData.email_id,
      );
      try {
        // Use Resend API to get full email details
        const response = await fetch(
          `https://api.resend.com/emails/${webhookData.email_id}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
          },
        );

        if (response.ok) {
          const emailDetails: ResendEmailDetails = await response.json();
          console.log(
            '[Inbound Email] Fetched email details:',
            JSON.stringify(emailDetails, null, 2),
          );
          emailText = emailDetails.text;
          emailHtml = emailDetails.html;
          if (emailDetails.headers) {
            headers = {
              ...headers,
              ...emailDetails.headers,
            };
          }
        } else {
          console.error(
            '[Inbound Email] Failed to fetch email details:',
            response.status,
            await response.text(),
          );
        }
      } catch (fetchError) {
        console.error(
          '[Inbound Email] Error fetching email details:',
          fetchError,
        );
      }
    }

    // Parse sender info
    const sender = parseEmailAddress(webhookData.from);

    // Try to find associated feedback
    let feedbackId: string | null = null;

    // First, try to find from thread (in-reply-to or references)
    const threadFeedback = await findFeedbackFromThread(
      headers['in-reply-to'],
      headers.references,
    );

    if (threadFeedback) {
      feedbackId = threadFeedback.id;
    } else {
      // Fallback: try to find by sender email
      const emailFeedback = await findFeedbackByEmail(sender.email);
      if (emailFeedback) {
        feedbackId = emailFeedback.id;
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
      hasText: !!emailText,
      hasHtml: !!emailHtml,
    });

    return NextResponse.json({ success: true, feedbackId });
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
