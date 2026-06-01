import type { StateCreator } from 'zustand';

export interface CollegeSlice {
  college: string | null;
  setCollege: (college: string | null) => void;
}

export const createCollegeSlice: StateCreator<CollegeSlice> = (set) => ({
  college: null,
  setCollege: (college: string | null) => {
    set({ college });
  },
});
