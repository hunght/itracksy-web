import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { sendFeedbackReplyEmail } from '@/app/services/email';
import { isUserAdmin } from '@/lib/auth';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check if user is authenticated and is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isUserAdmin(user)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const {
      feedbackId,
      to,
      subject,
      message,
      userName,
      originalMessage,
      feedbackType,
      inReplyTo, // Message ID of the email we're replying to (if any)
    } = await request.json();

    // Validate input
    if (!feedbackId || !to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Generate a message ID for this outbound email
    const messageId = `<${nanoid()}@itracksy.com>`;

    // Send email
    const emailResult = await sendFeedbackReplyEmail({
      to,
      subject,
      message,
      userName,
      originalMessage,
      feedbackType,
    });

    // Store outbound email in thread
    const { error: threadError } = await supabase.from('email_threads').insert({
      message_id: messageId,
      from_email: 'support@itracksy.com',
      from_name: 'iTracksy Support',
      to_email: to,
      subject,
      body_text: message,
      body_html: null, // We store the plain text version
      in_reply_to: inReplyTo || null,
      feedback_id: feedbackId,
      direction: 'outbound',
      is_read: true, // Outbound emails are always "read"
    });

    if (threadError) {
      console.error('Error storing outbound email in thread:', threadError);
      // Don't fail - email was still sent
    }

    // Update feedback record with replied_at timestamp
    const { error: updateError } = await supabase
      .from('feedback')
      .update({ replied_at: new Date().toISOString() })
      .eq('id', feedbackId);

    if (updateError) {
      console.error('Error updating feedback replied_at:', updateError);
      // Don't fail the request if update fails, email was still sent
    }

    return NextResponse.json({ success: true, messageId });
  } catch (error) {
    console.error('Feedback reply error:', error);
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 },
    );
  }
}
