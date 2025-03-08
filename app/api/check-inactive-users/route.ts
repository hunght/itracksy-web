import { NextResponse } from 'next/server';
import { getUsersInactiveFor7Days } from '@/app/services/user';
import { sendInactivityEmail } from '@/app/services/email';
import { createAdminClient } from '@/lib/supabase/server';
import { EMAIL_CAMPAIGNS } from '@/config/email_campaigns';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const inactiveUsers = await getUsersInactiveFor7Days();
    const supabase = createAdminClient();
    let notifiedCount = 0;

    for (const user of inactiveUsers) {
      if (user.email) {
        // Check if the email has already been sent
        const { data: userData } = await supabase
          .from('users')
          .select('email_campaign_status')
          .eq('id', user.id)
          .single();

        if (
          userData &&
          !(
            userData.email_campaign_status &
            EMAIL_CAMPAIGNS.INACTIVITY_REMINDER_7_DAYS
          )
        ) {
          await sendInactivityEmail(user.email);
          // Update the user's email campaign status
          await supabase
            .from('users')
            .update({
              email_campaign_status:
                userData.email_campaign_status |
                EMAIL_CAMPAIGNS.INACTIVITY_REMINDER_7_DAYS,
            })
            .eq('id', user.id);
          notifiedCount++;
        }
      }
    }

    return NextResponse.json({
      message: 'Inactive users notified successfully',
      processed: inactiveUsers.length,
      notified: notifiedCount,
    });
  } catch (error) {
    console.error('Error processing inactive users:', error);
    // Log the error to Sentry with the "cronjob" tag

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
