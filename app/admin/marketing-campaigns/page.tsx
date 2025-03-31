import { Metadata } from 'next';
import { CampaignDashboard } from '@/app/admin/marketing-campaigns/campaigns/campaign-dashboard';
import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = {
  title: 'Marketing Campaigns | iTRACKsy Admin',
  description: 'Create and manage marketing campaigns',
};

export default function MarketingCampaignsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        heading="Marketing Campaigns"
        subheading="Create campaigns and send emails to leads"
      />
      <CampaignDashboard />
    </div>
  );
}
