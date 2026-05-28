import AsyncStorage from '@react-native-async-storage/async-storage';
import type { create as CreateType } from 'zustand';
import type {
  createJSONStorage as CreateJSONStorageType,
  persist as PersistType,
} from 'zustand/middleware';

import { createAdmissionSlice } from './slices/admissionSlice';
import { createCollegeSlice } from './slices/collegeSlice';
import { createCompletedCoursesSlice } from './slices/completedCoursesSlice';
import { createDevelopmentSlice } from './slices/developmentSlice';
import { createEmploymentSlice } from './slices/employmentSlice';
import { createExperienceSlice } from './slices/experienceSlice';
import { createInterestSlice } from './slices/interestSlice';
import { createTrackSlice } from './slices/trackSlice';
import type { AdmissionSlice } from './slices/admissionSlice';
import type { CollegeSlice } from './slices/collegeSlice';
import type { CompletedCoursesSlice } from './slices/completedCoursesSlice';
import type { DevelopmentSlice } from './slices/developmentSlice';
import type { EmploymentSlice } from './slices/employmentSlice';
import type { ExperienceSlice } from './slices/experienceSlice';
import type { InterestSlice } from './slices/interestSlice';
import type { TrackSlice } from './slices/trackSlice';

declare const require: (id: string) => unknown;

const { create } = require('zustand') as {
  create: typeof CreateType;
};
const { createJSONStorage, persist } = require('zustand/middleware') as {
  createJSONStorage: typeof CreateJSONStorageType;
  persist: typeof PersistType;
};

export type { AffiliationType } from './slices/admissionSlice';

export type OnboardingState = AdmissionSlice &
  CollegeSlice &
  CompletedCoursesSlice &
  TrackSlice &
  InterestSlice &
  DevelopmentSlice &
  EmploymentSlice &
  ExperienceSlice;

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (...a) => ({
      ...createAdmissionSlice(...a),
      ...createCollegeSlice(...a),
      ...createCompletedCoursesSlice(...a),
      ...createTrackSlice(...a),
      ...createInterestSlice(...a),
      ...createDevelopmentSlice(...a),
      ...createEmploymentSlice(...a),
      ...createExperienceSlice(...a),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
