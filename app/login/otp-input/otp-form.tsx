'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyOTP } from './actions';
import { FiMail, FiLock } from 'react-icons/fi';

export default function OTPForm() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await verifyOTP(email, otp);
    if (result.error) {
      setError(result.error);
    } else {
      window.location.href = '/admin';
    }
  };

  return (
    <>
      <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Enter the one-time password sent to your email
      </p>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              value={email}
              readOnly
              className="w-full rounded-lg border bg-gray-50 py-2 pl-10 pr-3 text-gray-700 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
            />
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="otp"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            One-Time Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full rounded-lg border bg-white py-2 pl-10 pr-3 text-gray-700 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
              placeholder="Enter your OTP"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-purple-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 dark:bg-purple-700 dark:hover:bg-purple-600"
        >
          Verify OTP
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Didn&apos;t receive the OTP?{' '}
        <a
          href="#"
          className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
        >
          Resend OTP
        </a>
      </p>
    </>
  );
}
