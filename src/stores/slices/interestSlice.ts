import type { StateCreator } from 'zustand';

export interface InterestSlice {
  interests: string[];
  toggleInterest: (interest: string) => void;
  clearInterests: () => void;
}

export const createInterestSlice: StateCreator<InterestSlice> = (set) => ({
  interests: [],
  toggleInterest: (interest: string) => {
    set((state) => {
      if (state.interests.includes(interest)) {
        return { interests: state.interests.filter((item) => item !== interest) };
      }
      if (state.interests.length >= 5) return state;
      return { interests: [...state.interests, interest] };
    });
  },
  clearInterests: () => {
    set({ interests: [] });
  },
});
