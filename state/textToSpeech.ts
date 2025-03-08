import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const selectedVoiceAtom = atomWithStorage<string | null>(
  'selectedVoice',
  null,
);
export const voicesAtom = atom<SpeechSynthesisVoice[]>([]);
export const isPlayingAudioAtom = atom(false);
export const isPausedAudioAtom = atom(false);
