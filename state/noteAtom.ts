import { NoteType } from '@/types/note';
import { Session } from '@supabase/supabase-js';
import { atom } from 'jotai';
export const childNotesAtom = atom<Record<string, NoteType[]>>({});
export const sessionAtom = atom<Session | null>(null);
