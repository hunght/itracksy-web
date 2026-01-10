import { createSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PageSizeSelector from './components/PageSizeSelector';

import Link from 'next/link';
import { isUserAdmin } from '@/lib/auth';

interface AdminUserListProps {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}

export default async function AdminUserList({
  searchParams,
}: AdminUserListProps) {
  const supabase = await createSupabaseClient();
  const resolvedSearchParams = await searchParams;

  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const pageSize = parseInt(resolvedSearchParams.pageSize || '50', 10);

  // Check if the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) {
    redirect('/login');
  }

  // Check if the user has admin privileges
  if (!isUserAdmin(user)) {
    redirect('/');
  }

  console.log('user', user);
  // Fetch users with pagination

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Admin User List</h1>

      <PageSizeSelector pageSize={pageSize} />

      <div className="mt-6 flex items-center justify-between">
        {page > 1 && (
          <Link
            href={`/admin?page=${page - 1}&pageSize=${pageSize}`}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Previous
          </Link>
        )}
      </div>
    </div>
  );
}
