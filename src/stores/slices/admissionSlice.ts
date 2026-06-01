import type { StateCreator } from 'zustand';

export type AffiliationType = '1학년' | '2학년이상';

export interface AdmissionSlice {
  name: string;
  admissionYear: number | null;
  grade: number | null;
  affiliation: AffiliationType | null;
  setName: (name: string) => void;
  setAdmissionYear: (year: number) => void;
  setAffiliation: (type: AffiliationType) => void;
}

export const createAdmissionSlice: StateCreator<AdmissionSlice> = (set) => ({
  name: '',
  admissionYear: null,
  grade: null,
  affiliation: null,
  setName: (name: string) => set({ name: name.trim() }),
  setAdmissionYear: (year: number) => {
    const currentYear = new Date().getFullYear();
    const calculatedGrade = Math.max(1, currentYear - year + 1);
    set({ admissionYear: year, grade: calculatedGrade });
  },
  setAffiliation: (type: AffiliationType) => {
    set({ affiliation: type });
  },
});
