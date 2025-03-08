'use client';
import React, { useState } from 'react';

const PricingTier: React.FC<{
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}> = ({ name, price, features, recommended = false }) => {
  const [showCongrats, setShowCongrats] = useState(false);

  const handleGetStarted = () => {
    setShowCongrats(true);
  };

  return (
    <div
      className={`rounded-lg p-6 shadow-md ${recommended ? 'border-2 border-purple-500' : ''}`}
    >
      {recommended && (
        <span className="mb-2 inline-block rounded-full bg-purple-500 px-2 py-1 text-sm text-white">
          Recommended
        </span>
      )}
      <h3 className="mb-2 text-xl font-bold">{name}</h3>
      <p className="mb-4 text-3xl font-bold">{price}</p>
      <ul className="mb-6">
        {features.map((feature, index) => (
          <li key={index} className="mb-2 flex items-center">
            <svg
              className="mr-2 h-4 w-4 text-purple-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <button
        onClick={handleGetStarted}
        className="block w-full rounded-lg bg-purple-500 py-2 text-center text-white transition duration-300 hover:bg-purple-600"
      >
        Get Started
      </button>

      {showCongrats && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-purple-600">
              Congratulations!
            </h2>
            <p className="mb-4 text-lg text-gray-600">
              {`You're one of our first 100 users! Enjoy unlimited free rides on
              iTracksy.`}
            </p>

            <button
              onClick={() => setShowCongrats(false)}
              className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingTier;
