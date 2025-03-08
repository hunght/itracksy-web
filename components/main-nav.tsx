'use client';

import { siteConfig } from '@/config/site';
import { Icons } from './icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function MainNav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Image src="/logo-300.png" alt="Logo" width={48} height={48} />
        <span className="font-bold">{siteConfig.name}</span>
      </Link>
      <Link
        href="/blog"
        className={cn(
          'hidden text-sm font-medium transition-colors hover:text-primary sm:inline-block',
          pathname === '/blog' ? 'text-foreground' : 'text-foreground/60',
        )}
      >
        Blog
      </Link>
      <Link
        href="/pricing"
        className={cn(
          'hidden text-sm font-medium transition-colors hover:text-primary sm:inline-block',
          pathname === '/pricing' ? 'text-foreground' : 'text-foreground/60',
        )}
      >
        Pricing
      </Link>
      <Link
        href="/privacy-policy"
        className={cn(
          'hidden text-sm font-medium transition-colors hover:text-primary sm:inline-block',
          pathname === '/privacy-policy'
            ? 'text-foreground'
            : 'text-foreground/60',
        )}
      >
        Privacy Policy
      </Link>
      <Link
        href="/feedback"
        className={cn(
          'hidden text-sm font-medium transition-colors hover:text-primary sm:inline-block',
          pathname === '/feedback' ? 'text-foreground' : 'text-foreground/60',
        )}
      >
        Feedback
      </Link>
    </nav>
  );
}
