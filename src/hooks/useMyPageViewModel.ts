import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { AuthApiError } from '../api/authApi';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useProfileStore } from '../stores/profileStore';
import { useAuthStore } from '../stores/authStore';
import {
  COURSE_CATALOG_FOR_SELECTION,
  MOCK_RECOMMENDATION_HISTORY,
} from '../data/mockMyPageData';
import type { RecommendationHistoryItem } from '../data/mockMyPageData';
import {
  INTEREST_ID_MAP,
  DEV_FIELD_ID_MAP,
  COMPANY_TYPE_ID_MAP,
  WORK_VALUE_ID_MAP,
} from '../pages/onboarding/data/idMappings';
import type { RootStackParamList } from '../navigation/RootNavigator';

const EMPTY_PLACEHOLDER = '선택 없음';
const MAJOR_FALLBACK = 'IT공과대학';
const MAX_COMPLETED_COURSES = 30;

function toIds(labels: string[], map: Record<string, number>): number[] {
  return labels.map((l) => map[l]).filter((id): id is number => id !== undefined);
}

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
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const profile = useProfileStore((s) => s.profile);
  const patchProfile = useProfileStore((s) => s.patchProfile);
  const userName = useAuthStore((s) => s.userName);
  const accessToken = useAuthStore((s) => s.accessToken);

  const [isSaving, setIsSaving] = useState(false);

  const admissionYear = useOnboardingStore((s) => s.admissionYear);
  const college = useOnboardingStore((s) => s.college);
  const interests = useOnboardingStore((s) => s.interests);
  const developmentFields = useOnboardingStore((s) => s.developmentFields);
  const preferredCompanyTypes = useOnboardingStore((s) => s.preferredCompanyTypes);
  const employmentValues = useOnboardingStore((s) => s.employmentValues);

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

  const handlePatchError = (err: unknown): void => {
    if (err instanceof AuthApiError) {
      switch (err.code) {
        case 'AUTH_REQUIRED':
          rootNavigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
          break;
        case 'RESOURCE_NOT_FOUND':
          rootNavigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
          break;
        case 'VALIDATION_FAILED':
          Alert.alert('입력 오류', '입력 내용을 다시 확인해주세요.');
          break;
        default:
          Alert.alert('오류', err.message);
      }
    } else {
      Alert.alert('네트워크 오류', '잠시 후 다시 시도해주세요.');
    }
  };

  const runPatch = async (
    body: Parameters<typeof patchProfile>[1]
  ): Promise<boolean> => {
    if (!accessToken) {
      rootNavigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
      return false;
    }

    setIsSaving(true);
    try {
      await patchProfile(accessToken, body, rootNavigation);
      return true;
    } catch (err) {
      handlePatchError(err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateInterests = async (next: string[]): Promise<boolean> => {
    return runPatch({
      interestIds: toIds(next.slice(0, 5), INTEREST_ID_MAP),
    });
  };

  const updateDevelopmentFields = async (next: string[]): Promise<boolean> => {
    return runPatch({
      devFieldIds: toIds(next.slice(0, 3), DEV_FIELD_ID_MAP),
    });
  };

  const updateEmployment = async (next: {
    preferredCompanyTypes: string[];
    employmentValues: string[];
  }): Promise<boolean> => {
    return runPatch({
      companyTypeIds: toIds(next.preferredCompanyTypes, COMPANY_TYPE_ID_MAP),
      workValueIds: toIds(next.employmentValues.slice(0, 3), WORK_VALUE_ID_MAP),
    });
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
    isSaving,
    updateInterests,
    updateDevelopmentFields,
    updateEmployment,
    addCompletedCourse,
    removeCompletedCourse,
    handleHistoryPress,
  };
}
