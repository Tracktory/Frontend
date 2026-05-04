import { useOnboardingStore } from '../stores/onboardingStore';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'OnboardingConfirm'>;

export function useOnboardingConfirmViewModel(navigation: Navigation) {
  const admissionYear = useOnboardingStore((s) => s.admissionYear);
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

  const admissionYearLabel =
    admissionYear && grade ? `${admissionYear}년 (${grade}학년)` : null;

  const inputTags = experiencedFieldInput
    ? experiencedFieldInput
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const allExperiencedFields = [...new Set([...inputTags, ...experiencedFields])];

  const employmentChips = [...preferredCompanyTypes, ...employmentValues];

  const handleSave = () => {
    console.log('[Onboarding] 저장하고 추천받기 클릭');
    console.log('[Onboarding] 최종 데이터:', {
      admissionYear,
      grade,
      affiliation,
      college,
      track1,
      track2,
      interests,
      developmentFields,
      preferredCompanyTypes,
      employmentValues,
      experiencedFields: allExperiencedFields,
    });
    navigation.navigate('RecommendLoading');
  };

  return {
    admissionYearLabel,
    affiliation,
    college,
    track1,
    track2,
    interests,
    developmentFields,
    employmentChips,
    allExperiencedFields,
    handleSave,
  };
}
