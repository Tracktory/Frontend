import { Alert } from 'react-native';

import { useOnboardingStore } from '../stores/onboardingStore';
import { useProfileStore } from '../stores/profileStore';
import { useAuthStore } from '../stores/authStore';
import {
  COURSE_CATALOG_FOR_SELECTION,
  MOCK_RECOMMENDATION_HISTORY,
} from '../data/mockMyPageData';
import type { RecommendationHistoryItem } from '../data/mockMyPageData';

const EMPTY_PLACEHOLDER = '선택 없음';
const MAJOR_FALLBACK = 'IT공과대학';
const MAX_COMPLETED_COURSES = 30;

/** 입학연도 두 자리(YY학번 표기용) */
function twoDigitAdmissionYear(year: number): string {
  return `${year % 100}`.padStart(2, '0');
}

function formatAdmissionBadge(year: number | null): string {
  if (year == null) return EMPTY_PLACEHOLDER;
  return `${twoDigitAdmissionYear(year)}학번`;
}

function formatEmployment(
  preferred: string[],
  values: string[]
): string {
  const p = preferred.join(', ');
  const v = values.join(', ');
  if (!p && !v) return EMPTY_PLACEHOLDER;
  if (p && v) return `${p} · ${v}`;
  return p || v;
}

export function useMyPageViewModel() {
  const profile = useProfileStore((s) => s.profile);
  const userName = useAuthStore((s) => s.userName);

  const admissionYear = useOnboardingStore((s) => s.admissionYear);
  const college = useOnboardingStore((s) => s.college);
  const interests = useOnboardingStore((s) => s.interests);
  const toggleInterest = useOnboardingStore((s) => s.toggleInterest);
  const clearInterests = useOnboardingStore((s) => s.clearInterests);
  const developmentFields = useOnboardingStore((s) => s.developmentFields);
  const toggleDevelopmentField = useOnboardingStore((s) => s.toggleDevelopmentField);
  const clearDevelopmentFields = useOnboardingStore((s) => s.clearDevelopmentFields);
  const preferredCompanyTypes = useOnboardingStore((s) => s.preferredCompanyTypes);
  const togglePreferredCompanyType = useOnboardingStore((s) => s.togglePreferredCompanyType);
  const clearPreferredCompanyTypes = useOnboardingStore((s) => s.clearPreferredCompanyTypes);
  const employmentValues = useOnboardingStore((s) => s.employmentValues);
  const toggleEmploymentValue = useOnboardingStore((s) => s.toggleEmploymentValue);
  const clearEmploymentValues = useOnboardingStore((s) => s.clearEmploymentValues);

  // completedCourses는 Zustand store에서 관리 (로드맵 탭에서도 참조 가능)
  const completedCourses = useOnboardingStore((s) => s.completedCourses);
  const storeAddCompletedCourse = useOnboardingStore((s) => s.addCompletedCourse);
  const storeRemoveCompletedCourse = useOnboardingStore((s) => s.removeCompletedCourse);

  const recommendationHistory: RecommendationHistoryItem[] = MOCK_RECOMMENDATION_HISTORY;
  const courseCatalog = COURSE_CATALOG_FOR_SELECTION;

  const interestsLine =
    interests.length > 0 ? interests.join(', ') : EMPTY_PLACEHOLDER;
  const developmentLine =
    developmentFields.length > 0
      ? developmentFields.join(', ')
      : EMPTY_PLACEHOLDER;
  const employmentLine = formatEmployment(
    preferredCompanyTypes,
    employmentValues
  );

  const admissionBadge = formatAdmissionBadge(admissionYear);

  const displayName = profile?.profile.name ?? userName ?? '-';
  const profileInitial = displayName.length > 0 ? displayName.slice(-1) : '-';

  const sortedTracks = profile?.tracks
    ? [...profile.tracks].sort((a, b) => a.trackOrder - b.trackOrder)
    : [];
  const majorLine =
    sortedTracks.length > 0
      ? sortedTracks.map((t) => t.name).join(' · ')
      : (college ?? MAJOR_FALLBACK);

  const updateInterests = (next: string[]) => {
    clearInterests();
    next.slice(0, 5).forEach((item) => toggleInterest(item));
  };

  const updateDevelopmentFields = (next: string[]) => {
    clearDevelopmentFields();
    next.slice(0, 3).forEach((item) => toggleDevelopmentField(item));
  };

  const updateEmployment = (next: {
    preferredCompanyTypes: string[];
    employmentValues: string[];
  }) => {
    clearPreferredCompanyTypes();
    next.preferredCompanyTypes.forEach((item) => togglePreferredCompanyType(item));

    clearEmploymentValues();
    next.employmentValues.slice(0, 3).forEach((item) => toggleEmploymentValue(item));
  };

  const addCompletedCourse = (name: string): boolean => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('알림', '과목명을 입력해 주세요.');
      return false;
    }
    if (completedCourses.includes(trimmed)) {
      Alert.alert('알림', '이미 이수 과목에 추가된 과목입니다.');
      return false;
    }
    if (completedCourses.length >= MAX_COMPLETED_COURSES) {
      Alert.alert(
        '알림',
        `이수 과목은 최대 ${MAX_COMPLETED_COURSES}개까지 추가할 수 있습니다.`
      );
      return false;
    }
    return storeAddCompletedCourse(trimmed);
  };

  const removeCompletedCourse = (name: string) => {
    storeRemoveCompletedCourse(name);
  };

  const handleHistoryPress = (_item: RecommendationHistoryItem) => {
    Alert.alert('알림', '추천 결과 상세는 추후 제공됩니다.');
  };

  return {
    displayName,
    profileInitial,
    majorLine,
    admissionBadge,
    interests,
    developmentFields,
    preferredCompanyTypes,
    employmentValues,
    interestsLine,
    developmentLine,
    employmentLine,
    completedCourses,
    courseCatalog,
    recommendationHistory,
    updateInterests,
    updateDevelopmentFields,
    updateEmployment,
    addCompletedCourse,
    removeCompletedCourse,
    handleHistoryPress,
  };
}
