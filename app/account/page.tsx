'use client';
import React, { useState } from 'react';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { sessionAtom } from '@/state/noteAtom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, User } from 'lucide-react';
import { resetUser } from '@/lib/posthog';

export default function AccountPage() {
  const session = useAtomValue(sessionAtom);
  const supabaseClient = useSupabaseBrowser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const user = session?.user;
  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    '/default-avatar.png';

  const updateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const updates = {
      full_name: formData.get('fullName'),
      username: formData.get('username'),
      avatar_url: formData.get('avatarUrl'),
    };

    try {
      let { error } = await supabaseClient.auth.updateUser({ data: updates });
      if (error) throw error;
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating the profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    // Reset PostHog user identification
    resetUser();
    await supabaseClient.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">Account Settings</h1>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} alt={user?.email || 'User'} />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-xl font-semibold">
              {user?.user_metadata?.full_name || 'User'}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <form onSubmit={updateProfile}>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  defaultValue={user?.user_metadata?.full_name || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  defaultValue={user?.user_metadata?.username || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  name="avatarUrl"
                  defaultValue={avatarUrl}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <User className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      {message && (
        <Alert className="mt-6">
          <AlertTitle>Update Status</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
