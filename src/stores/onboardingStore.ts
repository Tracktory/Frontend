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
  college: string | null;
  interests: string[];
  developmentFields: string[];
  learningMethods: string[];
  setAdmissionYear: (year: number) => void;
  setAffiliation: (type: AffiliationType) => void;
  setCollege: (college: string) => void;
  toggleInterest: (interest: string) => void;
  clearInterests: () => void;
  toggleDevelopmentField: (field: string) => void;
  clearDevelopmentFields: () => void;
  toggleLearningMethod: (method: string) => void;
  clearLearningMethods: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      admissionYear: null,
      grade: null,
      affiliation: null,
      college: null,
      interests: [],
      developmentFields: [],
      learningMethods: [],
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
      setCollege: (college: string) => {
        set({ college });
      },
      toggleInterest: (interest: string) => {
        set((state) => {
          if (state.interests.includes(interest)) {
            return {
              interests: state.interests.filter((item) => item !== interest),
            };
          }
          if (state.interests.length >= 5) {
            return state;
          }
          return {
            interests: [...state.interests, interest],
          };
        });
      },
      clearInterests: () => {
        set({ interests: [] });
      },
      toggleDevelopmentField: (field: string) => {
        set((state) => {
          if (state.developmentFields.includes(field)) {
            return {
              developmentFields: state.developmentFields.filter((item) => item !== field),
            };
          }
          if (state.developmentFields.length >= 3) {
            return state;
          }
          return {
            developmentFields: [...state.developmentFields, field],
          };
        });
      },
      clearDevelopmentFields: () => {
        set({ developmentFields: [] });
      },
      toggleLearningMethod: (method: string) => {
        set((state) => {
          if (state.learningMethods.includes(method)) {
            return {
              learningMethods: state.learningMethods.filter((item) => item !== method),
            };
          }
          if (state.learningMethods.length >= 2) {
            return state;
          }
          return {
            learningMethods: [...state.learningMethods, method],
          };
        });
      },
      clearLearningMethods: () => {
        set({ learningMethods: [] });
      },
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
