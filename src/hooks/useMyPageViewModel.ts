import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { AuthApiError } from '../api/authApi';
import {
  addCompletedCourse as addCompletedCourseApi,
  deleteCompletedCourse as deleteCompletedCourseApi,
} from '../api/completedCoursesApi';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useProfileStore } from '../stores/profileStore';
import { useRecommendStore } from '../stores/recommendStore';
import { useAuthStore } from '../stores/authStore';
import { MOCK_RECOMMENDATION_HISTORY } from '../data/mockMyPageData';
import type { RecommendationHistoryItem } from '../data/mockMyPageData';
import { hansungCourseData } from '../data/hansungCourseData';
import type { HansungCourse } from '../data/hansungCourseData';
import {
  INTEREST_ID_MAP,
  DEV_FIELD_ID_MAP,
  COMPANY_TYPE_ID_MAP,
  WORK_VALUE_ID_MAP,
  TECH_STACK_ID_MAP,
  resolveTrackId,
} from '../pages/onboarding/data/idMappings';
import { TECH_TAG_OPTIONS } from '../pages/onboarding/data/onboardingOptions';
import { buildCourseCatalog, resolveSubjectId } from '../utils/buildCourseCatalog';
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
  const loadProfile = useProfileStore((s) => s.loadProfile);
  const patchProfile = useProfileStore((s) => s.patchProfile);
  const recommendResult = useRecommendStore((s) => s.result);
  const userName = useAuthStore((s) => s.userName);
  const accessToken = useAuthStore((s) => s.accessToken);

  const [isSaving, setIsSaving] = useState(false);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [removingCourseName, setRemovingCourseName] = useState<string | null>(null);

  const admissionYear = useOnboardingStore((s) => s.admissionYear);
  const grade = useOnboardingStore((s) => s.grade);
  const college = useOnboardingStore((s) => s.college);
  const interests = useOnboardingStore((s) => s.interests);
  const developmentFields = useOnboardingStore((s) => s.developmentFields);
  const preferredCompanyTypes = useOnboardingStore((s) => s.preferredCompanyTypes);
  const employmentValues = useOnboardingStore((s) => s.employmentValues);
  const track1 = useOnboardingStore((s) => s.track1);
  const track2 = useOnboardingStore((s) => s.track2);
  const experiencedFields = useOnboardingStore((s) => s.experiencedFields);

  const completedCourses = useOnboardingStore((s) => s.completedCourses);

  const recommendationHistory: RecommendationHistoryItem[] = MOCK_RECOMMENDATION_HISTORY;
  const courseCatalog: HansungCourse[] = hansungCourseData;

  const subjectIdCatalog = useMemo(
    () => buildCourseCatalog(recommendResult, profile),
    [recommendResult, profile]
  );

  const defaultCompletedYear = profile?.profile.currentYear ?? grade ?? 1;

  const sortedTracks = profile?.tracks
    ? [...profile.tracks].sort((a, b) => a.trackOrder - b.trackOrder)
    : [];

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

  const tracksLine =
    sortedTracks.length > 0
      ? sortedTracks.map((t) => t.name).join(' · ')
      : [track1, track2].filter(Boolean).join(' · ') || EMPTY_PLACEHOLDER;

  const experiencedLine =
    experiencedFields.length > 0
      ? experiencedFields.join(', ')
      : EMPTY_PLACEHOLDER;

  const admissionBadge = formatAdmissionBadge(admissionYear);

  const displayName = profile?.profile.name ?? userName ?? '-';
  const profileInitial = displayName.length > 0 ? displayName.slice(-1) : '-';

  const majorLine =
    sortedTracks.length > 0
      ? sortedTracks.map((t) => t.name).join(' · ')
      : (college ?? MAJOR_FALLBACK);

  const handleCourseApiError = (err: unknown): void => {
    if (err instanceof AuthApiError) {
      switch (err.code) {
        case 'AUTH_REQUIRED':
          rootNavigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
          break;
        case 'RESOURCE_NOT_FOUND':
          Alert.alert('알림', '해당 이수 과목이 존재하지 않습니다.');
          break;
        case 'SUBJECT_ALREADY_COMPLETED':
          Alert.alert('알림', '이미 이수 처리된 과목입니다.');
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

  const handlePatchError = (err: unknown): void => {
    if (err instanceof AuthApiError) {
      switch (err.code) {
        case 'AUTH_REQUIRED':
          rootNavigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
          break;
        case 'RESOURCE_NOT_FOUND':
          rootNavigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
          break;
        case 'SUBJECT_ALREADY_COMPLETED':
          Alert.alert('알림', '이미 이수 처리된 과목입니다.');
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

  const updateTracks = async (next: {
    track1: string;
    track2: string;
  }): Promise<boolean> => {
    const tracks: { trackId: number; trackOrder: 1 | 2 }[] = [];
    const id1 = resolveTrackId(next.track1.trim());
    if (id1) tracks.push({ trackId: id1, trackOrder: 1 });
    const id2 = resolveTrackId(next.track2.trim());
    if (id2) tracks.push({ trackId: id2, trackOrder: 2 });
    if (tracks.length === 0) {
      Alert.alert('입력 오류', '1트랙을 선택해주세요.');
      return false;
    }
    return runPatch({ tracks });
  };

  const updateExperience = async (next: string[]): Promise<boolean> => {
    const unique = [...new Set(next.map((s) => s.trim()).filter(Boolean))];
    const catalogTags = unique.filter((t) =>
      (TECH_TAG_OPTIONS as readonly string[]).includes(t)
    );
    const customTags = unique.filter(
      (t) => !(TECH_TAG_OPTIONS as readonly string[]).includes(t)
    );
    return runPatch({
      techStackIds: toIds(catalogTags, TECH_STACK_ID_MAP),
      techStackCustoms: customTags,
    });
  };

  const addCompletedCourse = async (course: HansungCourse): Promise<boolean> => {
    const name = course.subject;
    const year = defaultCompletedYear;
    const semester: 1 | 2 = 1;

    if (completedCourses.includes(name)) {
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

    if (!accessToken) {
      rootNavigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
      return false;
    }

    setIsAddingCourse(true);
    try {
      await addCompletedCourseApi(accessToken, { subjectName: name, year, semester });
      await loadProfile(accessToken, rootNavigation);
      return true;
    } catch (err) {
      handleCourseApiError(err);
      return false;
    } finally {
      setIsAddingCourse(false);
    }
  };

  const removeCompletedCourse = async (name: string): Promise<void> => {
    const subjectId = resolveSubjectId(name, profile, subjectIdCatalog);
    if (subjectId == null) {
      Alert.alert('알림', '과목 정보를 찾을 수 없습니다.');
      return;
    }
    if (!accessToken) {
      rootNavigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
      return;
    }

    setRemovingCourseName(name);
    try {
      await deleteCompletedCourseApi(accessToken, subjectId);
      await loadProfile(accessToken, rootNavigation);
    } catch (err) {
      handleCourseApiError(err);
    } finally {
      setRemovingCourseName(null);
    }
  };

  const handleHistoryPress = (_item: RecommendationHistoryItem) => {
    Alert.alert('알림', '추천 결과 상세는 추후 제공됩니다.');
  };

  return {
    displayName,
    profileInitial,
    majorLine,
    admissionBadge,
    track1,
    track2,
    interests,
    developmentFields,
    preferredCompanyTypes,
    employmentValues,
    experiencedFields,
    tracksLine,
    interestsLine,
    developmentLine,
    experiencedLine,
    employmentLine,
    completedCourses,
    courseCatalog,
    recommendationHistory,
    isSaving,
    isAddingCourse,
    removingCourseName,
    updateTracks,
    updateInterests,
    updateDevelopmentFields,
    updateExperience,
    updateEmployment,
    addCompletedCourse,
    removeCompletedCourse,
    handleHistoryPress,
  };
}
