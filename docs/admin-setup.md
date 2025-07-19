# Admin Access Setup

This document explains how to configure admin access for the iTracksy web application.

## Overview

The admin panel is protected at multiple levels:

1. **Authentication**: Users must be logged in
2. **Authorization**: Users must have admin privileges
3. **Route Protection**: Middleware redirects non-admin users to the homepage

## Setting Up Admin Users

There are three ways to grant admin access to users:

### Method 1: Environment Variable (Recommended for Production)

Set the `ADMIN_EMAILS` environment variable with a comma-separated list of admin email addresses:

```bash
ADMIN_EMAILS=admin@itracksy.com,john@company.com,mary@company.com
```

### Method 2: Supabase App Metadata (Most Secure)

Using Supabase admin functions, set the user's `app_metadata`:

```sql
-- Using SQL
UPDATE auth.users
SET app_metadata = app_metadata || '{"role": "admin"}'::jsonb
WHERE email = 'admin@itracksy.com';
```

Or using the Supabase Admin API:

```javascript
// Using Supabase Admin Client
const { data, error } = await supabase.auth.admin.updateUserById(userId, {
  app_metadata: { role: 'admin' },
});
```

### Method 3: User Metadata (Less Secure)

Set the user's `user_metadata` (this can be modified by the user, so it's less secure):

```javascript
const { data, error } = await supabase.auth.updateUser({
  data: { role: 'admin' },
});
```

## Admin Routes

All routes under `/admin/*` are protected:

- `/admin` - User list
- `/admin/leads` - Leads management
- `/admin/marketing-campaigns` - Marketing campaigns

## How It Works

1. **Middleware Protection**: The middleware (`lib/supabase/middleware.ts`) checks all `/admin/*` routes
2. **Page-Level Protection**: Each admin page also checks admin status as a double-check
3. **Redirect Behavior**: Non-admin users are redirected to the homepage (`/`)

## Security Notes

- `app_metadata` is more secure than `user_metadata` because users cannot modify it themselves
- Environment variables are good for simple setups but require deployment updates to change admin users
- The system checks admin status in this order:
  1. `app_metadata.role === 'admin'`
  2. `user_metadata.role === 'admin'`
  3. Email in the admin emails list

## Development

For local development, you can:

1. Add your email to the default admin emails list in `lib/auth.ts`
2. Set the `ADMIN_EMAILS` environment variable in your `.env.local` file
3. Use Supabase to set user metadata as described above

## Troubleshooting

If you're having trouble accessing admin routes:

1. Check that you're logged in
2. Verify your email is in the admin list or your user has the admin role
3. Check the browser console and network tab for redirect responses
4. Verify environment variables are loaded correctly

## Client-Side Components

For React components that need to conditionally show content based on admin status:

### Using the Admin Hook

```tsx
import { useIsAdmin } from '@/hooks/useAdminStatus';

function MyComponent() {
  const { isAdmin, loading } = useIsAdmin();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isAdmin && <button>Admin Only Button</button>}
      <p>Content for all users</p>
    </div>
  );
}
```

### Using Admin Components

```tsx
import { AdminOnly, AdminNavLink } from '@/components/AdminComponents';

function Navigation() {
  return (
    <nav>
      <AdminNavLink /> {/* Shows admin panel link only to admins */}
      <AdminOnly>
        <button>Admin Only Content</button>
      </AdminOnly>
    </nav>
  );
}
```

## Adding New Admin Routes

To protect new admin routes:

1. Ensure they start with `/admin/`
2. The middleware will automatically protect them
3. Optionally add page-level checks using `isUserAdmin()` for additional security
