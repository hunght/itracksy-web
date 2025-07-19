'use client';

import { useIsAdmin } from '@/hooks/useAdminStatus';
import Link from 'next/link';

/**
 * Component that shows admin navigation link only to admin users
 */
export function AdminNavLink() {
  const { isAdmin, loading } = useIsAdmin();

  if (loading) {
    return null; // or a loading spinner
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Link
      href="/admin"
      className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      Admin Panel
    </Link>
  );
}

/**
 * Higher-order component that only renders children for admin users
 */
export function AdminOnly({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useIsAdmin();

  if (loading) {
    return null; // or a loading spinner
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
