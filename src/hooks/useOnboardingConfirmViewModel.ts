import { useState } from 'react';
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
      rootNavigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
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
      return;
    }

    setIsSubmitting(true);
    try {
      await submitOnboarding(built.body, accessToken);
      setUserName(built.body.profile.name);
      await loadProfile(accessToken, rootNavigation);
      resetToRecommendLoading(rootNavigation, true);
    } catch (err) {
      if (err instanceof AuthApiError) {
        switch (err.code) {
          case 'AUTH_REQUIRED':
            rootNavigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
            break;
          case 'ONBOARDING_ALREADY_COMPLETED':
            resetToMainTabs(rootNavigation);
            break;
          default:
            if (__DEV__) console.warn('[onboarding]', err.code, err.message);
        }
      } else if (__DEV__) {
        console.warn('[onboarding] network error');
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
