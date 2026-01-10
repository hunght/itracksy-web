'use client';

import { CreateCampaignModal } from './create-campaign-modal';
import { CampaignsList } from './campaigns-list';

export function CampaignDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Campaigns</h2>
        <CreateCampaignModal />
      </div>

      <CampaignsList showAsCards />
    </div>
  );
}
