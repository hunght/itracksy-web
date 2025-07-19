'use client';

import { isUserAdmin, getUserRole } from '@/lib/auth';
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

/**
 * Hook to check if the current user is an admin
 * @returns Object with isAdmin boolean, userRole string, and loading state
 */
export function useAdminStatus() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    isAdmin: isUserAdmin(user),
    userRole: getUserRole(user),
    user,
    loading,
  };
}

/**
 * Hook that only returns true if user is admin, false otherwise
 * @returns Object with isAdmin boolean and loading state
 */
export function useIsAdmin() {
  const { isAdmin, loading } = useAdminStatus();
  return { isAdmin, loading };
}
