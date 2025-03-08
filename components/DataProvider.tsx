'use client';

import { allNotesQueryFn } from '@/app/services/notes';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { allNoteAtom } from '@/state/dashboardAtom';
import { sessionAtom } from '@/state/noteAtom';
import { useQuery } from '@tanstack/react-query';

import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useAtomValue(sessionAtom);

  const supabaseClient = useSupabaseBrowser();
  const allNotesQuery = useQuery({
    queryKey: ['all_notes'],
    queryFn: allNotesQueryFn(supabaseClient, session?.user.id),
    enabled: !!session && !!session.user.id,
  });
  const [_, setAllNoteAtom] = useAtom(allNoteAtom);

  useEffect(() => {
    setAllNoteAtom(allNotesQuery?.data ?? []);
  }, [allNotesQuery.data, setAllNoteAtom]);

  return <>{children}</>;
};
