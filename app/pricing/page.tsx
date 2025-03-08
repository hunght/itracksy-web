import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'iTracksy Pricing - Choose Your Plan',
  description:
    'Explore iTracksy pricing options and choose the plan that best fits your needs.',
  openGraph: {
    title: 'iTracksy Pricing - Choose Your Plan',
    description:
      'Explore iTracksy pricing options and choose the plan that best fits your needs.',
    url: 'https://www.itracksy.com/pricing',
  },
  twitter: {
    title: 'iTracksy Pricing - Choose Your Plan',
    description:
      'Explore iTracksy pricing options and choose the plan that best fits your needs.',
  },
};

const PricingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="mb-12 text-center text-4xl font-bold">
        Simple, Transparent Pricing
      </h1>
      <p className="mb-12 text-center text-lg">
        Just kidding, it&apos;s totally free!
      </p>
      <p className="text-center text-xl font-semibold">
        We believe in spreading joy, not emptying wallets. Enjoy iTracksy
        without spending a single beep... err, penny!
      </p>
    </div>
  );
};

export default PricingPage;
