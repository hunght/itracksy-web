'use client';

import React, { useState } from 'react';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function EmailSubscriptionForm() {
  const supabase = useSupabaseBrowser();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Save the email to the leads table
      const { error: supabaseError } = await supabase.from('leads').insert({
        name: email.split('@')[0], // Extract username part of email as name
        email: email,
        phone: 'Not provided', // Default value
        message: 'Homepage subscription',
        submission_time: new Date().toISOString(),
        group: 'newsletter-subscribers', // Group for these specific leads
      });

      if (supabaseError) {
        console.error('Error saving subscription:', supabaseError);
        // If it's a duplicate email error, still show success to the user
        if (supabaseError.code === '23505') {
          // Unique constraint violation code
          setIsSubscribed(true);
        } else {
          setError('Failed to subscribe. Please try again later.');
        }
      } else {
        // Set state to show success message
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {isSubscribed ? (
        <div className="rounded-md bg-green-50 p-4 text-green-800 dark:bg-green-950 dark:text-green-300">
          <p className="text-center font-medium">
            Thank you for subscribing! We&apos;ll keep you updated on the latest
            news and releases.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubscribe}
          className="flex flex-col space-y-3 sm:flex-row sm:space-x-2 sm:space-y-0"
        >
          <div className="flex-grow">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full"
              disabled={isSubmitting}
              aria-label="Email address"
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-amber-500 hover:bg-amber-600"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
      )}
    </div>
  );
}
