import { Database } from '@/lib/schema';

export type NoteType = Database['public']['Tables']['notes']['Row'];
export type NoteAllType = {
  id: string;
  title: string | null;
  updated_at: string;
  parent_id: string | null;
  is_favorite: boolean | null;
  deleted_at: string | null;
  children?: NoteAllType[];
};
export interface NodeMindMap {
  fy?: number | null;
  fx?: number | null;
  id: number;
  title: string;
  desc: string;
  x?: number;
  y?: number;
}

export interface LinkMindMap {
  source: number;
  target: number;
  label: string;
  desc: string;
  type: 'link' | 'child-link';
}
