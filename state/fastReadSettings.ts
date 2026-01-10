import { atomWithStorage } from 'jotai/utils';

export const speedAtom = atomWithStorage('reading-speed', 250);
export const fontAtom = atomWithStorage('reading-font', 'sans');
export const themeAtom = atomWithStorage('reading-theme', 'light');
