import type { StateCreator } from 'zustand';

export interface DevelopmentSlice {
  developmentFields: string[];
  toggleDevelopmentField: (field: string) => void;
  setDevelopmentFields: (fields: string[]) => void;
  clearDevelopmentFields: () => void;
}

export const createDevelopmentSlice: StateCreator<DevelopmentSlice> = (set) => ({
  developmentFields: [],
  toggleDevelopmentField: (field: string) => {
    set((state) => {
      if (state.developmentFields.includes(field)) {
        return {
          developmentFields: state.developmentFields.filter((item) => item !== field),
        };
      }
      if (state.developmentFields.length >= 3) return state;
      return { developmentFields: [...state.developmentFields, field] };
    });
  },
  setDevelopmentFields: (fields: string[]) => {
    const deduped = [...new Set(fields)].slice(0, 3);
    set({ developmentFields: deduped });
  },
  clearDevelopmentFields: () => {
    set({ developmentFields: [] });
  },
});
