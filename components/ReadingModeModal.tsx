'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { PlayCircleIcon } from 'lucide-react';

import { NoteType } from '@/types/note';
import { PublicNoteView } from './PublicNoteView';
import { useState } from 'react';

export default function ReadingModeModal({ note }: { note: NoteType }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="gap-2">
          <PlayCircleIcon className="h-6 w-6" />
          <span className="hidden sm:inline">Read Content</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0">
        <PublicNoteView
          note={note}
          isReadingMode={true}
          onClose={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
