import { User } from '@supabase/supabase-js';

// Get admin emails from environment variable or use default list
function getAdminEmails(): string[] {
  const envAdminEmails = process.env.ADMIN_EMAILS;

  if (envAdminEmails) {
    return envAdminEmails.split(',').map((email) => email.trim());
  }

  // Default admin emails - you should set ADMIN_EMAILS environment variable in production
  return [
    'admin@itracksy.com',
    'hth321@gmail.com',
    'phanviethieu3008@gmail.com',
    // Add more admin emails here
  ];
}

/**
 * Check if a user has admin privileges
 * This function checks both app_metadata.role and a list of admin emails
 */
export function isUserAdmin(user: User | null): boolean {
  if (!user) return false;

  // Check if user has admin role in app_metadata (most secure)
  if (user.app_metadata?.role === 'admin') {
    return true;
  }

  // Check if user has admin role in user_metadata (fallback)
  if (user.user_metadata?.role === 'admin') {
    return true;
  }

  // Check if user email is in the admin emails list
  if (user.email) {
    const adminEmails = getAdminEmails();
    return adminEmails.includes(user.email);
  }

  return false;
}

/**
 * Get user role from metadata
 */
export function getUserRole(user: User | null): string {
  if (!user) return 'guest';

  // Check app_metadata first (more secure)
  if (user.app_metadata?.role) {
    return user.app_metadata.role;
  }

  // Fallback to user_metadata
  if (user.user_metadata?.role) {
    return user.user_metadata.role;
  }

  // Check if user is in admin emails list
  if (user.email) {
    const adminEmails = getAdminEmails();
    if (adminEmails.includes(user.email)) {
      return 'admin';
    }
  }

  return 'user';
}
