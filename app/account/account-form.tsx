import { useCallback, useEffect, useState } from 'react';

import { type User } from '@supabase/supabase-js';

export default function AccountForm({ user }: { user: User | null }) {
  return (
    <div className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={user?.email} disabled />
      </div>
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input id="fullName" type="text" />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" />
      </div>

      <div>
        <button className="button primary block"></button>
      </div>

      <div>
        <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
