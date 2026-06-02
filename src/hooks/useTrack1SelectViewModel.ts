import { useOnboardingStore } from '../stores/onboardingStore';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'Track1Select'>;

export function useTrack1SelectViewModel(navigation: Navigation) {
  const track1 = useOnboardingStore((s) => s.track1);
  const setTrack1 = useOnboardingStore((s) => s.setTrack1);

  const canProceed = track1.trim().length > 0;

  const handleNext = () => {
    if (!canProceed) return;
    navigation.navigate('Track2Select');
  };

  return {
    track1,
    setTrack1,
    canProceed,
    handleNext,
  };
}
