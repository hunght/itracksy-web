import Link from 'next/link';
import { slug } from 'github-slugger';
import { badgeVariants } from './ui/badge';
import { cn } from '@/lib/utils';

interface TagProps {
  tag: string;
  current?: boolean;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function Tag({ tag, current, count, size = 'md' }: TagProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'px-3 py-1',
  };

  return (
    <Link
      className={cn(
        badgeVariants({
          variant: current ? 'default' : 'secondary',
          className: 'max-w-full rounded-md no-underline',
        }),
        sizeClasses[size],
        'inline-flex items-center overflow-hidden text-ellipsis whitespace-nowrap',
      )}
      href={`/tags/${slug(tag)}`}
      title={tag}
    >
      <span className="truncate">
        {tag} {count ? `(${count})` : null}
      </span>
    </Link>
  );
}
