import type { StateCreator } from 'zustand';

export interface EmploymentSlice {
  preferredCompanyTypes: string[];
  employmentValues: string[];
  togglePreferredCompanyType: (type: string) => void;
  clearPreferredCompanyTypes: () => void;
  toggleEmploymentValue: (value: string) => void;
  clearEmploymentValues: () => void;
}

export const createEmploymentSlice: StateCreator<EmploymentSlice> = (set) => ({
  preferredCompanyTypes: [],
  employmentValues: [],
  togglePreferredCompanyType: (type: string) => {
    set((state) => {
      if (state.preferredCompanyTypes.includes(type)) {
        return {
          preferredCompanyTypes: state.preferredCompanyTypes.filter((item) => item !== type),
        };
      }
      return { preferredCompanyTypes: [...state.preferredCompanyTypes, type] };
    });
  },
  clearPreferredCompanyTypes: () => {
    set({ preferredCompanyTypes: [] });
  },
  toggleEmploymentValue: (value: string) => {
    set((state) => {
      if (state.employmentValues.includes(value)) {
        return { employmentValues: state.employmentValues.filter((item) => item !== value) };
      }
      if (state.employmentValues.length >= 3) return state;
      return { employmentValues: [...state.employmentValues, value] };
    });
  },
  clearEmploymentValues: () => {
    set({ employmentValues: [] });
  },
});
