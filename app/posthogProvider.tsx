'use client';

import { PostHogProvider as Provider } from 'posthog-js/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useState } from 'react';
import { identifyUser, UserProperties } from '@/lib/posthog';
import posthog from 'posthog-js';

function PostHogPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        loaded: (ph) => {
          if (process.env.NODE_ENV === 'development') ph.debug();
        },
        capture_pageview: false,
      });
    }
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <Provider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageTracker />
      </Suspense>
      {children}
    </Provider>
  );
}

// Helper hook to identify users
export function usePostHogIdentify() {
  return {
    identifyUser: (distinctId: string, properties?: UserProperties) => {
      identifyUser(distinctId, properties);
    },
  };
}
