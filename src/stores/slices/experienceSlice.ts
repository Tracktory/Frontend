import type { StateCreator } from 'zustand';

export interface ExperienceSlice {
  experiencedFields: string[];
  experiencedFieldInput: string;
  toggleExperiencedField: (field: string) => void;
  clearExperiencedFields: () => void;
  setExperiencedFieldInput: (text: string) => void;
}

export const createExperienceSlice: StateCreator<ExperienceSlice> = (set) => ({
  experiencedFields: [],
  experiencedFieldInput: '',
  toggleExperiencedField: (field: string) => {
    set((state) => {
      if (state.experiencedFields.includes(field)) {
        return {
          experiencedFields: state.experiencedFields.filter((item) => item !== field),
        };
      }
      return { experiencedFields: [...state.experiencedFields, field] };
    });
  },
  clearExperiencedFields: () => {
    set({ experiencedFields: [] });
  },
  setExperiencedFieldInput: (text: string) => {
    set({ experiencedFieldInput: text });
  },
});
