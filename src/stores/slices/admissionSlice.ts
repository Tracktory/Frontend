import type { StateCreator } from 'zustand';

export type AffiliationType = '1학년' | '2학년이상';

export interface AdmissionSlice {
  admissionYear: number | null;
  grade: number | null;
  affiliation: AffiliationType | null;
  setAdmissionYear: (year: number) => void;
  setAffiliation: (type: AffiliationType) => void;
}

export const createAdmissionSlice: StateCreator<AdmissionSlice> = (set) => ({
  admissionYear: null,
  grade: null,
  affiliation: null,
  setAdmissionYear: (year: number) => {
    const currentYear = new Date().getFullYear();
    const calculatedGrade = Math.max(1, currentYear - year + 1);
    set({ admissionYear: year, grade: calculatedGrade });
  },
  setAffiliation: (type: AffiliationType) => {
    set({ affiliation: type });
  },
});
