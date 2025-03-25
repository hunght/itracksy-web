'use client';

import { handleDownload } from '@/utils/handleDownload';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';
import { MouseEventHandler } from 'react';
import { useAppVersion } from '@/hooks/use-app-version';

interface DownloadNowButtonProps {
  className?: string;
  children?: React.ReactNode;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function DownloadNowButton({
  className,
  children = 'Grab it now',
  variant = 'default',
  size = 'sm',
}: DownloadNowButtonProps) {
  const { links, loading } = useAppVersion();

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    // Use the dynamically fetched links
    handleDownload();
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        buttonVariants({ variant, size }),
        className ||
          'rounded-full bg-amber-500 font-medium text-white hover:bg-amber-600',
        loading && 'cursor-wait opacity-70',
      )}
    >
      {children}
    </button>
  );
}
