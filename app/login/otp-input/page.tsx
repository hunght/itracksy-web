'use client';

import { Suspense } from 'react';
import OTPForm from './otp-form';

export default function OTPInputPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h2 className="mb-6 text-center text-3xl font-bold text-purple-700 dark:text-purple-400">
          Verify OTP
        </h2>
        <Suspense fallback={<div>Loading...</div>}>
          <OTPForm />
        </Suspense>
      </div>
    </div>
  );
}
