import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const speedAtom = atomWithStorage('reading-speed', 250);
export const fontAtom = atomWithStorage('reading-font', 'sans');
export const themeAtom = atomWithStorage('reading-theme', 'light');

type ReadingProgressState = {
  currentSentence: number;
  isReading: boolean;
  isPaused: boolean;
  noteId: string | null;
};

export const readingProgressAtom = atomWithStorage<ReadingProgressState>('reading-progress', {
  currentSentence: 0,
  isReading: false,
  isPaused: false,
  noteId: null,
});
