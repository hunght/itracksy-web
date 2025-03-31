'use client';

import { useState } from 'react';
import { CreateCampaignModal } from './create-campaign-modal';
import { CampaignsList } from './campaigns-list';
import { CampaignDetails } from './campaign-details';
import { Card } from '@/components/ui/card';
import { Campaign } from '@/types/campaigns';

export function CampaignDashboard() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Campaigns</h2>
        <CreateCampaignModal
          onCampaignCreated={(campaign) => setSelectedCampaign(campaign)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="p-4 md:col-span-1">
          <CampaignsList
            onSelect={setSelectedCampaign}
            selectedCampaignId={selectedCampaign?.id}
          />
        </Card>

        <Card className="p-4 md:col-span-2">
          {selectedCampaign ? (
            <CampaignDetails
              campaign={selectedCampaign}
              onUpdate={(updated) => setSelectedCampaign(updated)}
            />
          ) : (
            <div className="flex h-[400px] items-center justify-center text-muted-foreground">
              Select a campaign or create a new one to get started
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
