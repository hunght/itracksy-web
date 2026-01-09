'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Users,
  Mail,
  MessageSquare,
  LayoutDashboard,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white dark:bg-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              <span className="text-lg font-semibold">iTracksy Admin</span>
            </Link>
          </div>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/admin" className="hover:text-gray-700">
              Admin
            </Link>
            {pathname !== '/admin' && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 dark:text-white">
                  {navItems.find(
                    (item) =>
                      item.href !== '/admin' && pathname?.startsWith(item.href),
                  )?.title || 'Page'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
