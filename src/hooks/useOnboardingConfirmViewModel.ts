import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { useOnboardingStore } from '../stores/onboardingStore';
import { useAuthStore } from '../stores/authStore';
import { useProfileStore } from '../stores/profileStore';
import { submitOnboarding } from '../api/onboardingApi';
import { AuthApiError } from '../api/authApi';
import { TECH_STACK_ID_MAP } from '../pages/onboarding/data/idMappings';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { resetToRecommendLoading } from '../utils/navigateToRecommendLoading';
import { resetToMainTabs } from '../utils/resetToMainTabs';
import { buildOnboardingRequestBody } from '../utils/buildOnboardingRequestBody';
import { formatValidationDetails } from '../utils/formatValidationDetails';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'OnboardingConfirm'>;

export function useOnboardingConfirmViewModel(_navigation: Navigation) {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const name = useOnboardingStore((s) => s.name);
  const grade = useOnboardingStore((s) => s.grade);
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
  const loadProfile = useProfileStore((s) => s.loadProfile);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const gradeLabel = grade != null ? `${grade}학년` : null;
  const isFirstYear = grade === 1;

  const inputTags = experiencedFieldInput
    ? experiencedFieldInput
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const allExperiencedFields = [...new Set([...inputTags, ...experiencedFields])];
  const catalogExperiencedFields = allExperiencedFields.filter(
    (t) => TECH_STACK_ID_MAP[t] !== undefined
  );
  const techStackCustoms = allExperiencedFields.filter(
    (t) => TECH_STACK_ID_MAP[t] === undefined
  );

  const employmentChips = [...preferredCompanyTypes, ...employmentValues];

  const affiliationLabel = isFirstYear ? '소속' : '선택 트랙';
  const affiliationValue = isFirstYear
    ? (college ?? '—')
    : track1
      ? `${track1}${track2 ? ` / ${track2}` : ''}`
      : '—';

  const jobPreferenceValue =
    employmentChips.length > 0 ? employmentChips.join(' · ') : '나중에 입력';

  const summaryRows = [
    { label: '학년', value: gradeLabel ?? '—' },
    { label: affiliationLabel, value: affiliationValue },
    { label: '관심 분야', value: `${interests.length}개` },
    { label: '흥미 개발분야', value: `${developmentFields.length}개` },
    { label: '희망 직무', value: jobPreferenceValue },
  ];

  const handleSave = async () => {
    if (!accessToken) {
      Alert.alert('오류', '로그인 상태를 확인해주세요.');
      return;
    }

    const built = buildOnboardingRequestBody({
      name,
      grade,
      college,
      track1,
      track2,
      interests,
      developmentFields,
      preferredCompanyTypes,
      employmentValues,
      catalogExperiencedFields,
      techStackCustoms,
    });

    if (!built.ok) {
      Alert.alert('입력 오류', built.error);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitOnboarding(built.body, accessToken);
      setUserName(built.body.profile.name);
      await loadProfile(accessToken, rootNavigation);
      resetToRecommendLoading(rootNavigation);
    } catch (err) {
      if (err instanceof AuthApiError) {
        switch (err.code) {
          case 'AUTH_REQUIRED':
            Alert.alert('인증 만료', '다시 로그인해주세요.');
            rootNavigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
            break;
          case 'ONBOARDING_ALREADY_COMPLETED':
            Alert.alert(
              '이미 설정 완료',
              '온보딩이 완료된 계정이에요. 마이페이지에서 정보를 수정할 수 있어요.',
              [
                {
                  text: '확인',
                  onPress: () => resetToMainTabs(rootNavigation),
                },
              ]
            );
            break;
          case 'VALIDATION_FAILED': {
            const detailText = formatValidationDetails(err.details);
            Alert.alert(
              '입력 오류',
              detailText
                ? `${err.message}\n\n${detailText}`
                : err.message || '입력 내용을 다시 확인해주세요.'
            );
            break;
          }
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
    gradeLabel,
    college,
    track1,
    track2,
    interests,
    developmentFields,
    employmentChips,
    allExperiencedFields,
    summaryRows,
    isSubmitting,
    handleSave,
  };
}
