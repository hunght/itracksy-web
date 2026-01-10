import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase/server';
import { isUserAdmin } from '@/lib/auth';
import { Resend } from 'resend';
import React from 'react';
import FeedbackReplyEmail from '@/emails/FeedbackReplyEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseClient();

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
      inReplyTo,
    } = await request.json();

    // Validate input
    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Send email via Resend using itracksy domain
    const emailComponent = FeedbackReplyEmail({
      userName: userName || 'there',
      message,
      originalMessage: originalMessage || '',
      feedbackType: feedbackType || 'general',
    }) as React.ReactElement;

    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: 'iTracksy Support <support@itracksy.com>',
      to,
      subject,
      react: emailComponent,
      headers: inReplyTo ? { 'In-Reply-To': inReplyTo } : undefined,
    });

    if (emailError) {
      console.error('Resend email error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 },
      );
    }

    // Store outbound email in email_threads for conversation tracking
    const { error: insertError } = await (supabase as unknown as { from: (table: string) => { insert: (data: Record<string, unknown>) => Promise<{ error: Error | null }> } })
      .from('email_threads')
      .insert({
        message_id: emailResult?.id || `outbound-${Date.now()}`,
        from_email: 'support@itracksy.com',
        from_name: 'iTracksy Support',
        to_email: to,
        subject,
        body_text: message,
        in_reply_to: inReplyTo || null,
        feedback_id: feedbackId !== 'direct-email' ? feedbackId : null,
        direction: 'outbound',
        is_read: true,
      });

    if (insertError) {
      console.error('Error storing outbound email:', insertError);
      // Don't fail - email was sent successfully
    }

    // Update feedback record with replied_at timestamp
    if (feedbackId && feedbackId !== 'direct-email') {
      const { error: updateError } = await (supabase as unknown as { from: (table: string) => { update: (data: Record<string, unknown>) => { eq: (column: string, value: string) => Promise<{ error: Error | null }> } } })
        .from('feedback')
        .update({ replied_at: new Date().toISOString() })
        .eq('id', feedbackId);

      if (updateError) {
        console.error('Error updating feedback replied_at:', updateError);
      }
    }

    return NextResponse.json({ success: true, messageId: emailResult?.id });
  } catch (error) {
    console.error('Feedback reply error:', error);
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 },
    );
  }
}
