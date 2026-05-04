import { useOnboardingStore } from '../stores/onboardingStore';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'CollegeSelect'>;

export function useCollegeSelectViewModel(navigation: Navigation) {
  const college = useOnboardingStore((s) => s.college);
  const setCollege = useOnboardingStore((s) => s.setCollege);

  const canProceed = college !== null;

  const handleNext = () => {
    if (!canProceed) return;
    navigation.navigate('InterestSelect');
  };

  return {
    college,
    canProceed,
    setCollege,
    handleNext,
  };
}
