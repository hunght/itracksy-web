'use client';

import { PostHogProvider as Provider } from 'posthog-js/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import posthogClient, { identifyUser, UserProperties } from '@/lib/posthog';

function PostHogPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (posthogClient && pathname) {
      let url = window.origin + pathname;
      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthogClient.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider client={posthogClient}>
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
