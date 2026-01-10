import { Database } from '@/lib/supabase';

export type Lead = Database['public']['Tables']['leads']['Insert'];
