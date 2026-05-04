import type { StateCreator } from 'zustand';

export interface CollegeSlice {
  college: string | null;
  setCollege: (college: string) => void;
}

export const createCollegeSlice: StateCreator<CollegeSlice> = (set) => ({
  college: null,
  setCollege: (college: string) => {
    set({ college });
  },
});
