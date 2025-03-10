'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Menu, X, Home, User, BookOpen, Lock, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Icons } from './icons';
import { siteConfig } from '@/config/site';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ModeToggle } from './mode-toggle';
import { resetUser } from '@/lib/posthog';

export const MobileNav: React.FunctionComponent<{
  isAuthenticated: boolean;
  userAvatar?: string;
}> = ({ isAuthenticated, userAvatar }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabaseClient = useSupabaseBrowser();

  const handleSignOut = async () => {
    // Reset PostHog user identification
    resetUser();
    await supabaseClient.auth.signOut();
    router.push('/login');
    setOpen(false);
  };

  const NavLink: React.FC<{
    href: string;
    icon: React.ElementType;
    children: React.ReactNode;
  }> = ({ href, icon: Icon, children }) => (
    <Link
      href={href}
      className={`flex items-center space-x-2 ${
        pathname === href ? 'text-primary' : 'text-foreground'
      }`}
      onClick={() => setOpen(false)}
    >
      <Icon size={20} />
      <span>{children}</span>
    </Link>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex h-full flex-col">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2"
              onClick={() => setOpen(false)}
            >
              <Icons.logo className="h-6 w-6" />
              <span className="text-lg font-bold">{siteConfig.name}</span>
            </Link>
          </div>

          <nav className="mb-6 space-y-4">
            <NavLink href="/" icon={Home}>
              Home
            </NavLink>
            <NavLink href="/blog" icon={BookOpen}>
              Blog
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink href="/admin" icon={User}>
                  Dashboard
                </NavLink>
                <NavLink href="/account" icon={User}>
                  Account
                </NavLink>
              </>
            ) : (
              <NavLink href="/login" icon={Lock}>
                Login
              </NavLink>
            )}
          </nav>

          <div className="mt-auto space-y-4">
            <ModeToggle />
            {isAuthenticated && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={userAvatar} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span>User</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut size={20} className="mr-2" />
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
