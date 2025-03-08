import { useSupabaseBrowser } from '@/lib/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PostgrestError } from '@supabase/supabase-js';

interface AddNoteToParentParams {
  childId: string;
  parentId: string | null;
}

export const useAddNoteToParent = () => {
  const supabaseClient = useSupabaseBrowser();
  const queryClient = useQueryClient();

  return useMutation<void, PostgrestError, AddNoteToParentParams>({
    mutationFn: async ({ childId, parentId }) => {
      if (!childId) {
        throw new Error('Child ID is required');
      }
      if (parentId === childId) {
        throw new Error('Parent ID cannot be the same as Child ID');
      }

      const { error } = await supabaseClient
        .from('notes')
        .update({ parent_id: parentId })
        .eq('id', childId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all_notes'] });
    },
  });
};
