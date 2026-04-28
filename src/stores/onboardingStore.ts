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
  // ON-SCR-04a
  interests: string[];
  // ON-SCR-06a (두 섹션 한 화면)
  preferredCompanyTypes: string[];
  employmentValues: string[];
  // ON-SCR-07a
  experiencedFields: string[];
  experiencedFieldInput: string;

  setAdmissionYear: (year: number) => void;
  setAffiliation: (type: AffiliationType) => void;
  setCollege: (college: string) => void;
  toggleInterest: (interest: string) => void;
  clearInterests: () => void;
  togglePreferredCompanyType: (type: string) => void;
  clearPreferredCompanyTypes: () => void;
  toggleEmploymentValue: (value: string) => void;
  clearEmploymentValues: () => void;
  toggleExperiencedField: (field: string) => void;
  clearExperiencedFields: () => void;
  setExperiencedFieldInput: (text: string) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      admissionYear: null,
      grade: null,
      affiliation: null,
      college: null,
      interests: [],
      preferredCompanyTypes: [],
      employmentValues: [],
      experiencedFields: [],
      experiencedFieldInput: '',

      setAdmissionYear: (year: number) => {
        const currentYear = new Date().getFullYear();
        const calculatedGrade = Math.max(1, currentYear - year + 1);
        set({ admissionYear: year, grade: calculatedGrade });
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
            return { interests: state.interests.filter((item) => item !== interest) };
          }
          if (state.interests.length >= 5) return state;
          return { interests: [...state.interests, interest] };
        });
      },
      clearInterests: () => {
        set({ interests: [] });
      },
      // 복수선택 (제한 없음)
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
      // 최대 3개
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
      // 선택사항 (최대 제한 없음)
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
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
