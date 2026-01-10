'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Users,
  Mail,
  MessageSquare,
  LayoutDashboard,
  Inbox,
} from 'lucide-react';

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Inbox',
    href: '/admin/inbox',
    icon: Inbox,
  },
  {
    title: 'Feedback',
    href: '/admin/feedback',
    icon: MessageSquare,
  },
  {
    title: 'Leads',
    href: '/admin/leads',
    icon: Users,
  },
  {
    title: 'Campaigns',
    href: '/admin/marketing-campaigns',
    icon: Mail,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const currentPage = navItems.find(
    (item) =>
      pathname === item.href ||
      (item.href !== '/admin' && pathname?.startsWith(item.href)),
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="flex w-64 flex-shrink-0 flex-col border-r bg-white dark:bg-gray-800">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold">iTracksy Admin</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 flex-shrink-0 items-center border-b bg-white px-6 dark:bg-gray-800">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {currentPage?.title || 'Admin'}
          </h1>
        </header>

        {/* Content */}
        <main className="min-h-0 flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
