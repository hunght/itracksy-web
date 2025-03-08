'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { NoteType } from '@/types/note';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { CopyCheck } from 'lucide-react';

export const CloneNoteButton: React.FC<{ note: NoteType }> = ({ note }) => {
  const router = useRouter();
  const supabase = useSupabaseBrowser();

  const handleClone = async () => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to clone this note.',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

    try {
      const { data: clonedNote, error } = await supabase
        .from('notes')
        .insert({
          title: `Clone of ${note.title}`,
          content: note.content,
          summary: note.summary,
          type: note.type,
          source_url: note.source_url,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Note cloned',
        description: 'The note has been successfully cloned to your account.',
      });

      router.push(`/dashboard/${clonedNote.id}`);
    } catch (error) {
      console.error('Error cloning note:', error);
      toast({
        title: 'Error',
        description: 'Failed to clone the note. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button onClick={handleClone} variant="outline">
      <CopyCheck className="mr-2 h-4 w-4" />
      Clone
    </Button>
  );
};
