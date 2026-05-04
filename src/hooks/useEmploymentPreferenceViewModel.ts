import { useOnboardingStore } from '../stores/onboardingStore';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'EmploymentPreference'>;

export function useEmploymentPreferenceViewModel(navigation: Navigation) {
  const selectedCompanyTypes = useOnboardingStore((s) => s.preferredCompanyTypes);
  const togglePreferredCompanyType = useOnboardingStore((s) => s.togglePreferredCompanyType);
  const selectedValues = useOnboardingStore((s) => s.employmentValues);
  const toggleEmploymentValue = useOnboardingStore((s) => s.toggleEmploymentValue);

  const valuesMaxReached = selectedValues.length >= 3;
  const canProceed = selectedCompanyTypes.length >= 1 && selectedValues.length >= 1;

  const handleToggleCompanyType = (type: string) => {
    togglePreferredCompanyType(type);
  };

  const handleToggleValue = (value: string) => {
    const alreadySelected = selectedValues.includes(value);
    if (!alreadySelected && valuesMaxReached) return;
    toggleEmploymentValue(value);
  };

  const handleNext = () => {
    if (!canProceed) return;
    navigation.navigate('GoalSelect');
  };

  return {
    selectedCompanyTypes,
    selectedValues,
    valuesMaxReached,
    canProceed,
    handleToggleCompanyType,
    handleToggleValue,
    handleNext,
  };
}
