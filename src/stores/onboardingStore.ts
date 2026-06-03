import type { create as CreateType } from 'zustand';

import { createAdmissionSlice } from './slices/admissionSlice';
import { createCollegeSlice } from './slices/collegeSlice';
import { createCompletedCoursesSlice } from './slices/completedCoursesSlice';
import { createDevelopmentSlice } from './slices/developmentSlice';
import { createEmploymentSlice } from './slices/employmentSlice';
import { createExperienceSlice } from './slices/experienceSlice';
import { createInterestSlice } from './slices/interestSlice';
import { createTrackSlice } from './slices/trackSlice';
import type { ProfileData } from '../api/profileApi';
import { mapProfileToOnboarding } from '../utils/mapProfileToOnboarding';
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

export type { AffiliationType } from './slices/admissionSlice';

type OnboardingDataState = AdmissionSlice &
  CollegeSlice &
  CompletedCoursesSlice &
  TrackSlice &
  InterestSlice &
  DevelopmentSlice &
  EmploymentSlice &
  ExperienceSlice;

/** 온보딩 입력 필드 초기값 (액션 제외) */
export function getInitialOnboardingState(): OnboardingDataState {
  return {
    name: '',
    admissionYear: null,
    grade: null,
    affiliation: null,
    college: null,
    completedCourses: [],
    track1: '',
    track2: '',
    interests: [],
    developmentFields: [],
    preferredCompanyTypes: [],
    employmentValues: [],
    experiencedFields: [],
    experiencedFieldInput: '',
  };
}

export type OnboardingState = OnboardingDataState & {
  setName: AdmissionSlice['setName'];
  setAdmissionYear: AdmissionSlice['setAdmissionYear'];
  setGrade: AdmissionSlice['setGrade'];
  setAffiliation: AdmissionSlice['setAffiliation'];
  setCollege: CollegeSlice['setCollege'];
  addCompletedCourse: CompletedCoursesSlice['addCompletedCourse'];
  removeCompletedCourse: CompletedCoursesSlice['removeCompletedCourse'];
  setCompletedCourses: CompletedCoursesSlice['setCompletedCourses'];
  setTrack1: TrackSlice['setTrack1'];
  setTrack2: TrackSlice['setTrack2'];
  toggleInterest: InterestSlice['toggleInterest'];
  setInterests: InterestSlice['setInterests'];
  clearInterests: InterestSlice['clearInterests'];
  toggleDevelopmentField: DevelopmentSlice['toggleDevelopmentField'];
  setDevelopmentFields: DevelopmentSlice['setDevelopmentFields'];
  clearDevelopmentFields: DevelopmentSlice['clearDevelopmentFields'];
  togglePreferredCompanyType: EmploymentSlice['togglePreferredCompanyType'];
  clearPreferredCompanyTypes: EmploymentSlice['clearPreferredCompanyTypes'];
  toggleEmploymentValue: EmploymentSlice['toggleEmploymentValue'];
  setEmploymentValues: EmploymentSlice['setEmploymentValues'];
  clearEmploymentValues: EmploymentSlice['clearEmploymentValues'];
  toggleExperiencedField: ExperienceSlice['toggleExperiencedField'];
  clearExperiencedFields: ExperienceSlice['clearExperiencedFields'];
  setExperiencedFieldInput: ExperienceSlice['setExperiencedFieldInput'];
  hydrateFromProfile: (data: ProfileData) => void;
  resetOnboarding: () => void;
};

export const useOnboardingStore = create<OnboardingState>()((...a) => ({
  ...createAdmissionSlice(...a),
  ...createCollegeSlice(...a),
  ...createCompletedCoursesSlice(...a),
  ...createTrackSlice(...a),
  ...createInterestSlice(...a),
  ...createDevelopmentSlice(...a),
  ...createEmploymentSlice(...a),
  ...createExperienceSlice(...a),
  hydrateFromProfile: (data: ProfileData) => {
    const mapped = mapProfileToOnboarding(data);
    a[0](mapped);
  },
  resetOnboarding: () => {
    a[0](getInitialOnboardingState());
  },
}));
