import AsyncStorage from '@react-native-async-storage/async-storage';
import type { create as CreateType } from 'zustand';
import type {
  createJSONStorage as CreateJSONStorageType,
  persist as PersistType,
} from 'zustand/middleware';
//zustand 아키텍쳐 사용 모듈 추가

declare const require: (id: string) => unknown;

const { create } = require('zustand') as {
  create: typeof CreateType;
};
const { createJSONStorage, persist } = require('zustand/middleware') as {
  createJSONStorage: typeof CreateJSONStorageType;
  persist: typeof PersistType;
};

export type AffiliationType = '1학년' | '2학년이상';

interface OnboardingState {
  admissionYear: number | null;
  grade: number | null;
  affiliation: AffiliationType | null;
  setAdmissionYear: (year: number) => void;
  setAffiliation: (type: AffiliationType) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      admissionYear: null,
      grade: null,
      affiliation: null,
      setAdmissionYear: (year: number) => {
        const currentYear = new Date().getFullYear();
        const calculatedGrade = Math.max(1, currentYear - year + 1);

        set({
          admissionYear: year,
          grade: calculatedGrade,
        });
      },
      setAffiliation: (type: AffiliationType) => {
        set({ affiliation: type });
      },
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
