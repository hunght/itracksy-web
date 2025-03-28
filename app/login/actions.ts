'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createSupabaseClient } from '@/lib/supabase/server';
import { identifyUser, resetUser } from '@/lib/posthog';

export const signIn = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect('/login?message=Could not authenticate user');
  }

  // Identify user in PostHog
  if (data.user) {
    identifyUser(data.user.id, {
      email: data.user.email,
      name: data.user.user_metadata?.full_name,
    });
  }

  return redirect('/admin');
};

export const signUp = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createSupabaseClient();

  // Get the site URL from environment variable or fallback to the origin header
  const siteUrl = headers().get('origin');

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    return redirect('/login?message=Could not authenticate user');
  }

  return redirect('/login?message=Check email to continue sign in process');
};

export async function loginWithGoogle() {
  const supabase = createSupabaseClient();

  // Get the site URL from environment variable or fallback to the origin header
  const siteUrl = headers().get('origin');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    return redirect('/login?message=Could not authenticate user');
  }

  // Note: For OAuth, user identification will happen in the callback route
  // since we don't have user data here yet

  return redirect(data.url);
}

export const loginWithOTP = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const supabase = createSupabaseClient();

  // Get the site URL from environment variable or fallback to the origin header
  const siteUrl = headers().get('origin');

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    console.error('Error sending OTP:', error);
    return redirect('/login?message=Could not send OTP');
  }

  // Redirect to the OTP input page
  return redirect('/login/otp-input?email=' + encodeURIComponent(email));
};
