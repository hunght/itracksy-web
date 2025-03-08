import { TypedSupabaseClient } from '@/types/supabase';

export function allNotesQueryFn(
  supabaseClient: TypedSupabaseClient,
  userId?: string,
) {
  if (!userId) {
    return async () => {
      return [];
    };
  }
  return async () => {
    const { data, error } = await supabaseClient
      .from('notes')
      .select(`id, title, updated_at, parent_id, is_favorite, deleted_at`)
      .eq('user_id', userId)
      .is('deleted_at', null) // Add this line to exclude deleted notes
      .order('updated_at', { ascending: false });
    console.log('data ', data);
    if (error) {
      throw new Error(error.message);
    }

    return data;
  };
}

export function getTrashedNotes(
  supabaseClient: TypedSupabaseClient,
  userId?: string,
) {
  if (!userId) {
    return async () => {
      return [];
    };
  }
  return async () => {
    const { data, error } = await supabaseClient
      .from('notes')
      .select(`id, title, updated_at, parent_id, is_favorite, deleted_at`)
      .eq('user_id', userId)
      .not('deleted_at', 'is', null)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };
}

export function allSearchNotesQueryFn(
  supabaseClient: TypedSupabaseClient,
  userId?: string,
) {
  if (!userId) {
    return async () => {
      return [];
    };
  }
  return async () => {
    const { data, error } = await supabaseClient
      .from('notes')
      .select(
        `id, title, updated_at, content, parent_id, is_favorite, deleted_at`,
      )
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('updated_at', { ascending: false })
      .limit(20);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };
}
export function getDetailNoteQueryFn(
  supabaseClient: TypedSupabaseClient,
  id?: string,
) {
  if (!id) {
    return async () => {
      return null;
    };
  }
  return async () => {
    const { data, error } = await supabaseClient
      .from('notes')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
}

export function deleteNoteMutationFn(supabaseClient: TypedSupabaseClient) {
  return async (id: string) => {
    const { data, error } = await supabaseClient
      .from('notes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
}

export function saveNoteMutationFn(supabaseClient: TypedSupabaseClient) {
  return async ({
    title,
    content,
    id,
  }: {
    title: string;
    content: string;
    id: number;
  }) => {
    const { data, error } = await supabaseClient
      .from('notes')
      .update({ title, content })
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
}

export function searchNotesQueryFn(
  supabaseClient: TypedSupabaseClient,
  searchQuery: string,
) {
  return async () => {
    const words = searchQuery
      .split(' ')
      .map((word) => word.trim())
      .filter((word) => word.length > 0);
    const { data, error } = await supabaseClient
      .from('notes')
      .select()
      .textSearch('fts', words.join(' & '))
      .order('updated_at', { ascending: false })
      .limit(10);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
}

export function getChildNotesQueryFn(
  supabaseClient: TypedSupabaseClient,
  parentId?: number,
) {
  if (!parentId) {
    return async () => [];
  }
  return async () => {
    const { data, error } = await supabaseClient
      .from('notes')
      .select()
      .eq('parent_id', parentId)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
}
