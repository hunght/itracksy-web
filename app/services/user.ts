import { createClient } from '@/lib/supabase/server';

export async function getUsersInactiveFor7Days() {
  const supabase = createClient();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0); // Set to start of the day

  const sixDaysAgo = new Date(sevenDaysAgo);
  sixDaysAgo.setDate(sixDaysAgo.getDate() + 1);

  const { data, error } = await supabase
    .from('users')
    .select('id, email')
    .gte('last_active', sevenDaysAgo.toISOString())
    .lt('last_active', sixDaysAgo.toISOString());

  if (error) {
    console.error('Error fetching inactive users:', error);
    throw error;
  }
  return data;
}
