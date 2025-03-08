import UserList from './UserList';
import { EMAIL_CAMPAIGNS } from '@/config/email_campaigns';
import { createAdminClient } from '@/lib/supabase/server';

type User = {
  id: string;
  email: string | null;
  email_campaign_status: number;
};

export default async function MarketingCampaignsPage() {
  const supabase = createAdminClient();

  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, email_campaign_status')
    .order('email', { ascending: true });

  if (error) {
    console.error('Error fetching users:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900 dark:text-white">
      <h1 className="mb-6 text-3xl font-bold dark:text-gray-100">
        Email Campaigns
      </h1>
      <div>
        <h2 className="mb-4 text-2xl font-semibold dark:text-gray-200">
          User List
        </h2>
        <UserList users={users || []} emailCampaigns={EMAIL_CAMPAIGNS} />
      </div>
    </div>
  );
}
