import { createBrowserClient } from '@supabase/ssr';

import { useMemo } from 'react';
import { Database } from '../supabase';

type BrowserClient = ReturnType<typeof createBrowserClient<Database>>;

let client: BrowserClient | undefined;

function getSupabaseBrowserClient(): BrowserClient {
  if (client) {
    return client;
  }

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  return client;
}

export function useSupabaseBrowser() {
  return useMemo(getSupabaseBrowserClient, []);
}
