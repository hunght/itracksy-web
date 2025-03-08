'use server';

import { revalidatePath } from 'next/cache';
import {
  sendInactivityEmail,
  sendWelcomeEmail,
  sendProductUpdateEmail,
} from '@/app/services/email';
import { createAdminClient } from '@/lib/supabase/server';

export async function sendCampaigns(
  selectedUsers: { [key: string]: number },
  users: User[],
  emailCampaigns: EmailCampaigns,
) {
  'use server';

  const updatedUsers = [...users];
  for (const [userId, campaigns] of Object.entries(selectedUsers)) {
    const user = updatedUsers.find((u) => u.id === userId);
    if (user) {
      for (const [campaignName, campaignValue] of Object.entries(
        emailCampaigns,
      )) {
        if ((campaigns & campaignValue) === campaignValue && user.email) {
          try {
            switch (campaignName) {
              case 'INACTIVITY_REMINDER_7_DAYS':
                await sendInactivityEmail(user.email);
                break;
              case 'WELCOME_SERIES':
                await sendWelcomeEmail(user.email);
                break;
              case 'PRODUCT_UPDATE':
                await sendProductUpdateEmail(user.email);
                break;
            }
            user.email_campaign_status |= campaignValue;
          } catch (error) {
            console.error(
              `Failed to send ${campaignName} email to ${user.email}:`,
              error,
            );
          }
        }
      }
    }
  }

  // Update users in the database
  // This is a placeholder - replace with your actual database update logic
  await updateUsers(updatedUsers);

  // Revalidate the page to reflect the changes
  revalidatePath('/admin/marketing-campaigns');
}

async function updateUsers(updatedUsers: User[]) {
  const supabase = createAdminClient();
  for (const user of updatedUsers) {
    const { error } = await supabase
      .from('users')
      .update({ email_campaign_status: user.email_campaign_status })
      .eq('id', user.id);
    if (error) {
      console.error(`Error updating user ${user.id}:`, error);
    }
  }

  revalidatePath('/admin/marketing-campaigns');
}
