import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { sendFeedbackReplyEmail } from '@/app/services/email';
import { isUserAdmin } from '@/lib/auth';

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
    } = await request.json();

    // Validate input
    if (!feedbackId || !to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Send email
    await sendFeedbackReplyEmail({
      to,
      subject,
      message,
      userName,
      originalMessage,
      feedbackType,
    });

    // Update feedback record with replied_at timestamp
    const { error: updateError } = await supabase
      .from('feedback')
      .update({ replied_at: new Date().toISOString() })
      .eq('id', feedbackId);

    if (updateError) {
      console.error('Error updating feedback replied_at:', updateError);
      // Don't fail the request if update fails, email was still sent
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback reply error:', error);
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 },
    );
  }
}
