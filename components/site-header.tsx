import { cn } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from './ui/button';

import { MobileNav } from './mobile-nav';
import { ModeToggle } from './mode-toggle';

import Image from 'next/image';

interface SiteHeaderProps {
  isLoginPage?: boolean;
}

export function SiteHeader({ isLoginPage = false }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="TRACKSY"
              width={72}
              height={72}
              className="h-10 w-auto"
            />
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/resources"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Resources
            </Link>
            <Link
              href="/feedback"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Feedback
            </Link>
            <div className="flex items-center">
              <ModeToggle />
            </div>
          </nav>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: 'sm' }),
              'rounded-full bg-amber-500 font-medium text-white hover:bg-amber-600',
            )}
          >
            Grab it now
          </Link>

          <MobileNav isAuthenticated={false} />
        </div>
      </div>
    </header>
  );
}
