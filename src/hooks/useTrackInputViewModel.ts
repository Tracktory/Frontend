import { useOnboardingStore } from '../stores/onboardingStore';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'TrackInput'>;

export function useTrackInputViewModel(navigation: Navigation) {
  const track1 = useOnboardingStore((s) => s.track1);
  const track2 = useOnboardingStore((s) => s.track2);
  const setTrack1 = useOnboardingStore((s) => s.setTrack1);
  const setTrack2 = useOnboardingStore((s) => s.setTrack2);

  const canProceed = track1.trim().length > 0;

  const handleNext = () => {
    if (!canProceed) return;
    navigation.navigate('InterestSelect');
  };

  return {
    track1,
    track2,
    canProceed,
    setTrack1,
    setTrack2,
    handleNext,
  };
}
