import type { StateCreator } from 'zustand';

export interface TrackSlice {
  track1: string;
  track2: string;
  setTrack1: (value: string) => void;
  setTrack2: (value: string) => void;
}

export const createTrackSlice: StateCreator<TrackSlice> = (set) => ({
  track1: '',
  track2: '',
  setTrack1: (value: string) => {
    set({ track1: value });
  },
  setTrack2: (value: string) => {
    set({ track2: value });
  },
});
