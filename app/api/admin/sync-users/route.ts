import { createAdminClient } from '@/lib/supabase/server';
import { UserSyncData } from '@/types/user';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body: { users: UserSyncData[] } = await request.json();

  const supabase = createAdminClient();

  try {
    for (const user of body.users) {
      const { error: upsertError } = await supabase
        .from('users')
        .update({
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
        })
        .eq('id', user.id);

      if (upsertError) {
        throw upsertError;
      }
    }

    return NextResponse.json({ message: 'Users synced successfully' });
  } catch (error) {
    console.error('Error syncing users:', error);
    return NextResponse.json(
      { error: 'Failed to sync users' },
      { status: 500 },
    );
  }
}
