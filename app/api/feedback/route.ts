import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase/server';
import { sendFeedbackNotificationEmail } from '@/app/services/email';

export async function POST(request: Request) {
  try {
    const { name, email, feedback_type, message } = await request.json();

    // Validate input
    if (!name || !feedback_type || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Initialize Supabase client
    const supabase = await createSupabaseClient();

    // Insert feedback into database
    const { error } = await supabase.from('feedback').insert({
      name: `iTracksy:${name}`,
      email,
      feedback_type,
      message,
    });

    if (error) {
      console.error('Error inserting feedback:', error);
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 },
      );
    }

    // Send email notification
    try {
      await sendFeedbackNotificationEmail(name, email, feedback_type, message);
    } catch (emailError) {
      console.error('Error sending feedback notification email:', emailError);
      // Continue even if email fails, just log the error
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
