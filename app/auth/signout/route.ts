import { createSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { resetUser } from '@/lib/posthog';

export async function POST(req: NextRequest) {
  const supabase = createSupabaseClient();

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Reset PostHog user identification
    resetUser();
    await supabase.auth.signOut();
  }

  revalidatePath('/', 'layout');
  return NextResponse.redirect(new URL('/login', req.url), {
    status: 302,
  });
}
