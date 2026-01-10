import posthog from 'posthog-js';

export interface UserProperties {
  email?: string;
  name?: string;
  [key: string]: any;
}

export const identifyUser = (
  distinctId: string,
  userProperties?: UserProperties,
) => {
  if (typeof window !== 'undefined') {
    posthog.identify(distinctId, userProperties);
  }
};

export const resetUser = () => {
  if (typeof window !== 'undefined') {
    posthog.reset();
  }
};

export default posthog;
