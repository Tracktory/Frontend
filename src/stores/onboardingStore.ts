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
  onboardingGoals: string[];
  collaborationStyles: string[];
  setAdmissionYear: (year: number) => void;
  setAffiliation: (type: AffiliationType) => void;
  setCollege: (college: string) => void;
  toggleInterest: (interest: string) => void;
  clearInterests: () => void;
  toggleDevelopmentField: (field: string) => void;
  clearDevelopmentFields: () => void;
  toggleLearningMethod: (method: string) => void;
  clearLearningMethods: () => void;
  toggleOnboardingGoal: (goal: string) => void;
  clearOnboardingGoals: () => void;
  toggleCollaborationStyle: (style: string) => void;
  clearCollaborationStyles: () => void;
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
      onboardingGoals: [],
      collaborationStyles: [],
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
      toggleOnboardingGoal: (goal: string) => {
        set((state) => {
          if (state.onboardingGoals.includes(goal)) {
            return {
              onboardingGoals: state.onboardingGoals.filter((item) => item !== goal),
            };
          }
          if (state.onboardingGoals.length >= 2) {
            return state;
          }
          return {
            onboardingGoals: [...state.onboardingGoals, goal],
          };
        });
      },
      clearOnboardingGoals: () => {
        set({ onboardingGoals: [] });
      },
      toggleCollaborationStyle: (style: string) => {
        set((state) => {
          if (state.collaborationStyles.includes(style)) {
            return {
              collaborationStyles: state.collaborationStyles.filter((item) => item !== style),
            };
          }
          if (state.collaborationStyles.length >= 2) {
            return state;
          }
          return {
            collaborationStyles: [...state.collaborationStyles, style],
          };
        });
      },
      clearCollaborationStyles: () => {
        set({ collaborationStyles: [] });
      },
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
