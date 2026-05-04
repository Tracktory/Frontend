import { useOnboardingStore } from '../stores/onboardingStore';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'DevelopmentFieldSelect'>;

export function useDevelopmentFieldSelectViewModel(navigation: Navigation) {
  const developmentFields = useOnboardingStore((s) => s.developmentFields);
  const toggleDevelopmentField = useOnboardingStore((s) => s.toggleDevelopmentField);

  const maxReached = developmentFields.length >= 3;
  const canProceed = developmentFields.length >= 1;

  const handleToggle = (field: string) => {
    const alreadySelected = developmentFields.includes(field);
    if (!alreadySelected && maxReached) return;
    toggleDevelopmentField(field);
  };

  const handleNext = () => {
    if (!canProceed) return;
    navigation.navigate('EmploymentPreference');
  };

  return {
    developmentFields,
    maxReached,
    canProceed,
    handleToggle,
    handleNext,
  };
}
