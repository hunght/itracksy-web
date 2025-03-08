import { createAdminClient } from '@/lib/supabase/server';
import { UserSyncData } from '@/types/user';
import { sendWelcomeEmail } from '@/app/services/email';
import { NextResponse } from 'next/server';
import { EMAIL_CAMPAIGNS } from '@/config/email_campaigns';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('User created webhook received', body);

    // Extract user email, id, and first name from the webhook payload
    const { id, email, user_metadata } = body.record;
    const firstName = user_metadata?.first_name || 'there';

    // Send welcome email
    await sendWelcomeEmail(email, firstName);

    // Update user record
    const supabase = createAdminClient();
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('email_campaign_status')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching user data:', fetchError);
      throw fetchError;
    }

    const currentStatus = userData?.email_campaign_status || 0;
    const newStatus = currentStatus | EMAIL_CAMPAIGNS.WELCOME_SERIES;

    const { data, error } = await supabase
      .from('users')
      .update({ email_campaign_status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating user record:', error);
      throw error;
    }

    return NextResponse.json({
      message:
        'User created webhook received, welcome email sent, and user updated',
    });
  } catch (error) {
    console.error('Error processing user created webhook:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
