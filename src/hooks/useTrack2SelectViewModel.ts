import { useOnboardingStore } from '../stores/onboardingStore';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'Track2Select'>;

export function useTrack2SelectViewModel(navigation: Navigation) {
  const track2 = useOnboardingStore((s) => s.track2);
  const setTrack2 = useOnboardingStore((s) => s.setTrack2);

  const handleNext = () => {
    navigation.navigate('InterestSelect');
  };

  const handleSkip = () => {
    setTrack2('');
    navigation.navigate('InterestSelect');
  };

  return {
    track2,
    setTrack2,
    handleNext,
    handleSkip,
  };
}
