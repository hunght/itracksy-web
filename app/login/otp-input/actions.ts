'use server';

import { createSupabaseClient } from '@/lib/supabase/server';

export async function verifyOTP(email: string, otp: string) {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'email',
  });

  if (error) {
    return { error: error.message };
  }

  return { data };
}
