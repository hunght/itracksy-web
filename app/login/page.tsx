import Image from 'next/image';
import { loginWithGoogle, loginWithOTP } from './actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FaGoogle, FaEnvelope } from 'react-icons/fa';

import { EmailOTPInput } from './EmailOTPInput';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login to iTracksy | Activity & Project Tracking Assistant',
  description:
    'Securely log in to your iTracksy account and start tracking your activities, managing projects, and analyzing your productivity.',
  robots: 'noindex, nofollow', // Prevent indexing of login page
};

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <Card className="w-full max-w-md overflow-hidden rounded-lg shadow-2xl">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-4xl font-bold text-foreground">
            Welcome to iTracksy
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Your productivity tracking companion
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="mb-8 flex justify-center">
            <Image
              src={'/logo-300.png'}
              alt="iTracksy Logo"
              width={120}
              height={120}
              className="rounded-full shadow-md"
            />
          </div>
          <p className="mb-8 text-center text-base text-muted-foreground">
            Track your activities, manage projects, and gain valuable insights
            into your productivity. Sign in to start optimizing your workflow.
          </p>
          <form>
            <Button
              formAction={loginWithGoogle}
              className="w-full transform bg-primary py-6 text-lg text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/90"
            >
              <FaGoogle className="mr-3 text-xl" />
              Continue with Google
            </Button>
          </form>
          {/* divider */}
          <div className="m-4 h-px bg-gray-200"></div>
          <EmailOTPInput />
        </CardContent>
      </Card>
    </div>
  );
}
