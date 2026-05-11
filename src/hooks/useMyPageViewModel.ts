import { useState } from 'react';
import { Alert } from 'react-native';

import { useOnboardingStore } from '../stores/onboardingStore';
import {
  MOCK_COMPLETED_COURSES,
  MOCK_RECOMMENDATION_HISTORY,
} from '../data/mockMyPageData';
import type { RecommendationHistoryItem } from '../data/mockMyPageData';

const EMPTY_PLACEHOLDER = '선택 없음';
const DISPLAY_NAME_FALLBACK = '00';
const MAJOR_FALLBACK = '한성대 IT융합공학부';

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
  const admissionYear = useOnboardingStore((s) => s.admissionYear);
  const college = useOnboardingStore((s) => s.college);
  const interests = useOnboardingStore((s) => s.interests);
  const developmentFields = useOnboardingStore((s) => s.developmentFields);
  const preferredCompanyTypes = useOnboardingStore((s) => s.preferredCompanyTypes);
  const employmentValues = useOnboardingStore((s) => s.employmentValues);

  const [completedCourses] = useState<string[]>(() => [...MOCK_COMPLETED_COURSES]);

  const recommendationHistory: RecommendationHistoryItem[] = MOCK_RECOMMENDATION_HISTORY;

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
  /** 스토어에 이름 없음 — 시안 플레이스홀더 유지 */
  const displayName = DISPLAY_NAME_FALLBACK;
  /** 아바타 중앙 한 글자 */
  const profileInitial = displayName.slice(-1);

  const majorLine = college ?? MAJOR_FALLBACK;

  const handleEditSection = (_key: 'interests' | 'development' | 'employment') => {
    Alert.alert('알림', '수정 기능은 추후 제공됩니다.');
  };

  const handleAddCourse = () => {
    Alert.alert(
      '과목 추가',
      '직접 과목 선택·추가는 API 연동 후 제공됩니다. (목업 상태)'
    );
  };

  const handleHistoryPress = (_item: RecommendationHistoryItem) => {
    Alert.alert('알림', '추천 결과 상세는 추후 제공됩니다.');
  };

  return {
    displayName,
    profileInitial,
    majorLine,
    admissionBadge,
    interestsLine,
    developmentLine,
    employmentLine,
    completedCourses,
    recommendationHistory,
    handleEditSection,
    handleAddCourse,
    handleHistoryPress,
  };
}
