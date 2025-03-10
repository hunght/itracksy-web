'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { identifyUser, resetUser } from '@/lib/posthog';

export const signIn = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createClient();

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
  const origin = headers().get('origin');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return redirect('/login?message=Could not authenticate user');
  }

  return redirect('/login?message=Check email to continue sign in process');
};

export async function loginWithGoogle() {
  const origin = headers().get('origin');
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
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
  const origin = headers().get('origin');
  const email = formData.get('email') as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('Error sending OTP:', error);
    return redirect('/login?message=Could not send OTP');
  }

  // Redirect to the OTP input page
  return redirect('/login/otp-input?email=' + encodeURIComponent(email));
};
