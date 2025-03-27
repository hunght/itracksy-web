import { Database } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

export type TypedSupabaseClient = SupabaseClient<Database>;

export type Lead = Database['public']['Tables']['leads']['Insert'];
export type Feedback = Database['public']['Tables']['feedback']['Row'];
export type EmailEvent = Database['public']['Tables']['email_events']['Row'];
