import { useOnboardingStore } from '../stores/onboardingStore';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'AdmissionYear'>;

export function useAdmissionYearViewModel(navigation: Navigation) {
  const admissionYear = useOnboardingStore((s) => s.admissionYear);
  const setAdmissionYear = useOnboardingStore((s) => s.setAdmissionYear);

  const isYearSelected = admissionYear !== null;

  const handleNext = () => {
    if (!isYearSelected) return;
    navigation.navigate('Affiliation');
  };

  return {
    admissionYear,
    isYearSelected,
    setAdmissionYear,
    handleNext,
  };
}
