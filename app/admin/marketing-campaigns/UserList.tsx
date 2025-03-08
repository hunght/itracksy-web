'use client';

import React, { useState } from 'react';
import { useTransition } from 'react';
import { sendCampaigns } from './actions';
import { FaEnvelope } from 'react-icons/fa'; // Import the envelope icon

const UserList: React.FC<UserListProps> = ({ users, emailCampaigns }) => {
  const [selectedUsers, setSelectedUsers] = useState<{ [key: string]: number }>(
    {},
  );
  const [isPending, startTransition] = useTransition();
  const [selectAll, setSelectAll] = useState<{ [key: number]: boolean }>({});

  const isCampaignEnabled = (status: number, campaign: number) => {
    return (status & campaign) === campaign;
  };

  const handleCheckboxChange = (userId: string, campaignValue: number) => {
    setSelectedUsers((prev) => {
      const newStatus = prev[userId]
        ? prev[userId] ^ campaignValue
        : campaignValue;
      return { ...prev, [userId]: newStatus };
    });
  };

  const handleSelectAll = (campaignValue: number) => {
    setSelectAll((prev) => ({
      ...prev,
      [campaignValue]: !prev[campaignValue],
    }));
    setSelectedUsers((prev) => {
      const newSelectedUsers = { ...prev };
      users.forEach((user) => {
        if (!isCampaignEnabled(user.email_campaign_status, campaignValue)) {
          newSelectedUsers[user.id] =
            (newSelectedUsers[user.id] || 0) ^ campaignValue;
        }
      });
      return newSelectedUsers;
    });
  };

  const handleSendCampaigns = () => {
    startTransition(async () => {
      try {
        await sendCampaigns(selectedUsers, users, emailCampaigns);
        setSelectedUsers({});
      } catch (error) {
        console.error('Failed to send campaigns:', error);
      }
    });
  };

  return (
    <div>
      <table className="mb-4 w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Email</th>
            {Object.entries(emailCampaigns).map(([campaign, value]) => (
              <th key={campaign} className="border p-2">
                <div className="flex items-center justify-between">
                  <span>{campaign}</span>
                  <input
                    type="checkbox"
                    checked={selectAll[value] || false}
                    onChange={() => handleSelectAll(value)}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.email}</td>
              {Object.entries(emailCampaigns).map(([campaign, value]) => {
                const isEnabled = isCampaignEnabled(
                  user.email_campaign_status,
                  value,
                );
                return (
                  <td key={campaign} className="border p-2 text-center">
                    {isEnabled ? (
                      <FaEnvelope className="mx-auto text-green-500" />
                    ) : (
                      <input
                        type="checkbox"
                        checked={isCampaignEnabled(
                          selectedUsers[user.id] || 0,
                          value,
                        )}
                        onChange={() => handleCheckboxChange(user.id, value)}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
        onClick={handleSendCampaigns}
        disabled={isPending}
      >
        {isPending ? 'Sending...' : 'Send Selected Campaigns'}
      </button>
    </div>
  );
};

export default UserList;
