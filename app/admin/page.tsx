import { createAdminClient, createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PageSizeSelector from './components/PageSizeSelector';
import UserSelectionTable from './components/UserSelectionTable';

import { User } from '@supabase/supabase-js';
import Link from 'next/link';

export default async function AdminUserList({
  searchParams,
}: {
  searchParams: { page?: string; pageSize?: string };
}) {
  const supabase = createClient();
  const supabaseAdmin = createAdminClient();
  const page = parseInt(searchParams.page || '1', 10);
  const pageSize = parseInt(searchParams.pageSize || '50', 10);

  // Check if the user is an admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) {
    redirect('/login');
  }
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user?.id)
    .single();
  console.log('user', userData);
  // Fetch users with pagination
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: page,
    perPage: pageSize,
  });
  const count = 'total' in data ? data.total : 0;
  const users: User[] = data?.users;
  if (error) {
    console.error('Error fetching users:', error);
    return <div>Error loading users. Please try again later.</div>;
  }

  const totalPages = Math.ceil(count / pageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Admin User List</h1>

      <PageSizeSelector pageSize={pageSize} />

      <UserSelectionTable users={users} />

      <div className="mt-6 flex items-center justify-between">
        {page > 1 && (
          <Link
            href={`/admin?page=${page - 1}&pageSize=${pageSize}`}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Previous
          </Link>
        )}
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        {page < totalPages && (
          <Link
            href={`/admin?page=${page + 1}&pageSize=${pageSize}`}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
