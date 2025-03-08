'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { UserSyncData } from '@/types/user';

export default function UserSelectionTable({ users }: { users: User[] }) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(users.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSyncInfo = async () => {
    setIsLoading(true);
    try {
      const usersToSync: UserSyncData[] = users
        .filter((user) => selectedUsers.includes(user.id))
        .map((user) => ({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name,
          avatar_url: user.user_metadata?.avatar_url,
        }));

      const response = await fetch('/api/admin/sync-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ users: usersToSync }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync users');
      }

      toast({
        title: 'Success',
        description: 'Users updated successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error updating users:', error);
      toast({
        title: 'Error',
        description: 'Failed to update users. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow-md">
      <div className="p-4">
        <button
          onClick={handleSyncInfo}
          disabled={selectedUsers.length === 0 || isLoading}
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Syncing...' : 'Sync Info for Selected Users'}
        </button>
      </div>
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedUsers.length === users.length}
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Last Active
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleSelectUser(user.id)}
                />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {user.id}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {user.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {user.created_at && new Date(user.created_at).toLocaleString()}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {user.last_sign_in_at &&
                  new Date(user.last_sign_in_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
