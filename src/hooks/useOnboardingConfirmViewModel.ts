import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { useOnboardingStore } from '../stores/onboardingStore';
import { useAuthStore } from '../stores/authStore';
import { submitOnboarding } from '../api/onboardingApi';
import { AuthApiError } from '../api/authApi';
import {
  INTEREST_ID_MAP,
  DEV_FIELD_ID_MAP,
  COMPANY_TYPE_ID_MAP,
  WORK_VALUE_ID_MAP,
  TECH_STACK_ID_MAP,
  DEPARTMENT_ID_MAP,
  resolveDepartmentIdForTrack,
  resolveTrackId,
} from '../pages/onboarding/data/idMappings';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'OnboardingConfirm'>;

function toIds(labels: string[], map: Record<string, number>): number[] {
  return labels.map((l) => map[l]).filter((id): id is number => id !== undefined);
}

export function useOnboardingConfirmViewModel(navigation: Navigation) {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const admissionYear = useOnboardingStore((s) => s.admissionYear);
  const name = useOnboardingStore((s) => s.name);
  const grade = useOnboardingStore((s) => s.grade);
  const affiliation = useOnboardingStore((s) => s.affiliation);
  const college = useOnboardingStore((s) => s.college);
  const track1 = useOnboardingStore((s) => s.track1);
  const track2 = useOnboardingStore((s) => s.track2);
  const interests = useOnboardingStore((s) => s.interests);
  const developmentFields = useOnboardingStore((s) => s.developmentFields);
  const preferredCompanyTypes = useOnboardingStore((s) => s.preferredCompanyTypes);
  const employmentValues = useOnboardingStore((s) => s.employmentValues);
  const experiencedFields = useOnboardingStore((s) => s.experiencedFields);
  const experiencedFieldInput = useOnboardingStore((s) => s.experiencedFieldInput);

  const accessToken = useAuthStore((s) => s.accessToken);
  const setUserName = useAuthStore((s) => s.setUserName);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const admissionYearLabel =
    admissionYear && grade ? `${admissionYear}년 (${grade}학년)` : null;

  const inputTags = experiencedFieldInput
    ? experiencedFieldInput
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const allExperiencedFields = [...new Set([...inputTags, ...experiencedFields])];
  const techStackCustoms = inputTags.filter((t) => TECH_STACK_ID_MAP[t] === undefined);

  const employmentChips = [...preferredCompanyTypes, ...employmentValues];

  const handleSave = async () => {
    if (!accessToken) {
      Alert.alert('오류', '로그인 상태를 확인해주세요.');
      return;
    }

    if (!name.trim()) {
      Alert.alert('입력 오류', '이름을 입력해주세요.');
      return;
    }

    const tracks: { trackId: number; trackOrder: 1 | 2 }[] = [];
    if (affiliation === '1학년' && college) {
      const deptId = DEPARTMENT_ID_MAP[college];
      if (deptId) tracks.push({ trackId: deptId, trackOrder: 1 });
    } else {
      if (track1) {
        const id = resolveTrackId(track1);
        if (id) tracks.push({ trackId: id, trackOrder: 1 });
      }
      if (track2) {
        const id = resolveTrackId(track2);
        if (id) tracks.push({ trackId: id, trackOrder: 2 });
      }
    }

    const departmentId =
      affiliation === '1학년'
        ? (college ? (DEPARTMENT_ID_MAP[college] ?? 0) : 0)
        : (track1 ? (resolveDepartmentIdForTrack(track1) ?? 0) : 0);

    const body = {
      profile: {
        currentYear: grade ?? 1,
        name: name.trim(),
        departmentId,
      },
      tracks,
      interestIds: toIds(interests, INTEREST_ID_MAP),
      devFieldIds: toIds(developmentFields, DEV_FIELD_ID_MAP),
      companyTypeIds: toIds(preferredCompanyTypes, COMPANY_TYPE_ID_MAP),
      workValueIds: toIds(employmentValues, WORK_VALUE_ID_MAP),
      techStackIds: toIds(experiencedFields, TECH_STACK_ID_MAP),
      techStackCustoms,
      completedSubjects: [], // TODO: subjectId 매핑 확보 후 구현
    };

    setIsSubmitting(true);
    try {
      await submitOnboarding(body, accessToken);
      setUserName(name.trim());
      navigation.navigate('RecommendLoading');
    } catch (err) {
      if (err instanceof AuthApiError) {
        switch (err.code) {
          case 'AUTH_REQUIRED':
            Alert.alert('인증 만료', '다시 로그인해주세요.');
            rootNavigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
            break;
          case 'ONBOARDING_ALREADY_COMPLETED':
            navigation.navigate('RecommendLoading');
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    admissionYearLabel,
    affiliation,
    college,
    track1,
    track2,
    interests,
    developmentFields,
    employmentChips,
    allExperiencedFields,
    isSubmitting,
    handleSave,
  };
}
