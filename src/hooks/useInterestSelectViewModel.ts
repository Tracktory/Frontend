import { useOnboardingStore } from '../stores/onboardingStore';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'InterestSelect'>;

export function useInterestSelectViewModel(navigation: Navigation) {
  const interests = useOnboardingStore((s) => s.interests);
  const toggleInterest = useOnboardingStore((s) => s.toggleInterest);

  const maxReached = interests.length >= 5;
  const canProceed = interests.length >= 1;

  const handleToggle = (interest: string) => {
    const alreadySelected = interests.includes(interest);
    if (!alreadySelected && maxReached) return;
    toggleInterest(interest);
  };

  const handleNext = () => {
    if (!canProceed) return;
    navigation.navigate('DevelopmentFieldSelect');
  };

  return {
    interests,
    maxReached,
    canProceed,
    handleToggle,
    handleNext,
  };
}
