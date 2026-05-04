import { useOnboardingStore } from '../stores/onboardingStore';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'GoalSelect'>;

export function useExperiencedFieldViewModel(navigation: Navigation) {
  const selectedFields = useOnboardingStore((s) => s.experiencedFields);
  const toggleExperiencedField = useOnboardingStore((s) => s.toggleExperiencedField);
  const fieldInput = useOnboardingStore((s) => s.experiencedFieldInput);
  const setExperiencedFieldInput = useOnboardingStore((s) => s.setExperiencedFieldInput);

  const handleNext = () => {
    navigation.navigate('OnboardingConfirm');
  };

  const handleSkip = () => {
    navigation.navigate('OnboardingConfirm');
  };

  return {
    selectedFields,
    fieldInput,
    toggleExperiencedField,
    setExperiencedFieldInput,
    handleNext,
    handleSkip,
  };
}
