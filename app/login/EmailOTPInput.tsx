'use client';

import { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginWithOTP } from './actions';

export function EmailOTPInput() {
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');

  const handleOTPLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    await loginWithOTP(formData);
  };

  if (!showEmailInput) {
    return (
      <Button
        type="button"
        onClick={() => setShowEmailInput(true)}
        className="mt-4 w-full transform bg-secondary py-6 text-lg text-secondary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:bg-secondary/90"
      >
        <FaEnvelope className="mr-3 text-xl" />
        Continue with Email OTP
      </Button>
    );
  }

  return (
    <form onSubmit={handleOTPLogin} className="mt-4 space-y-4">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button
        type="submit"
        className="w-full transform bg-secondary py-6 text-lg text-secondary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:bg-secondary/90"
      >
        Send OTP
      </Button>
    </form>
  );
}
