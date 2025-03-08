import posthog from 'posthog-js';
import { PostHog } from 'posthog-js';

export const posthogClient: PostHog | undefined =
  typeof window !== 'undefined'
    ? posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') posthog.debug();
        },
        capture_pageview: false,
      })
    : undefined;

export interface UserProperties {
  email?: string;
  name?: string;
  [key: string]: any;
}

export const identifyUser = (
  distinctId: string,
  userProperties?: UserProperties
) => {
  if (posthogClient) {
    posthogClient.identify(distinctId, userProperties);
  }
};

export const resetUser = () => {
  if (posthogClient) {
    posthogClient.reset();
  }
};

export default posthogClient;
