import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  heading: string;
  subheading?: string;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  heading,
  subheading,
  children,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
          {subheading && <p className="text-muted-foreground">{subheading}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
