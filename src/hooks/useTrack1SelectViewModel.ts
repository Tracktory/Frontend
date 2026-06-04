import { useState } from 'react';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';
import { findCollegeForTrack } from '../pages/onboarding/data/onboardingOptions';
import { resolveTrackFromUserInput } from '../pages/onboarding/utils/resolveTrackFromUserInput';
import { useOnboardingStore } from '../stores/onboardingStore';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'Track1Select'>;

const TRACK_NOT_FOUND = '등록된 트랙을 찾지 못했어요';

export function useTrack1SelectViewModel(navigation: Navigation) {
  const storedTrack1 = useOnboardingStore((s) => s.track1);
  const storedTrack2 = useOnboardingStore((s) => s.track2);
  const setTrack1 = useOnboardingStore((s) => s.setTrack1);
  const setTrack2 = useOnboardingStore((s) => s.setTrack2);
  const setCollege = useOnboardingStore((s) => s.setCollege);

  const [track1Input, setTrack1Input] = useState(storedTrack1);
  const [track2Input, setTrack2Input] = useState(storedTrack2);
  const [track1Error, setTrack1Error] = useState<string | null>(null);
  const [track2Error, setTrack2Error] = useState<string | null>(null);

  const canProceed = track1Input.trim().length > 0;

  const commitTracksAndNavigate = () => {
    const resolved1 = resolveTrackFromUserInput(track1Input);
    if (!resolved1) {
      setTrack1Error(TRACK_NOT_FOUND);
      setTrack2Error(null);
      return false;
    }

    let resolved2: string | null = null;
    if (track2Input.trim()) {
      resolved2 = resolveTrackFromUserInput(track2Input);
      if (!resolved2) {
        setTrack2Error(TRACK_NOT_FOUND);
        setTrack1Error(null);
        return false;
      }
    }

    setTrack1(resolved1);
    setTrack2(resolved2 ?? '');
    const college = findCollegeForTrack(resolved1);
    if (college) setCollege(college);
    setTrack1Error(null);
    setTrack2Error(null);
    navigation.navigate('InterestSelect');
    return true;
  };

  const handleNext = () => {
    if (!canProceed) return;
    commitTracksAndNavigate();
  };

  const handleSkip = () => {
    if (!canProceed) return;
    const resolved1 = resolveTrackFromUserInput(track1Input);
    if (!resolved1) {
      setTrack1Error(TRACK_NOT_FOUND);
      return;
    }
    setTrack1(resolved1);
    setTrack2('');
    const college = findCollegeForTrack(resolved1);
    if (college) setCollege(college);
    setTrack1Error(null);
    setTrack2Error(null);
    navigation.navigate('InterestSelect');
  };

  return {
    track1Input,
    track2Input,
    setTrack1Input: (v: string) => {
      setTrack1Input(v);
      setTrack1Error(null);
    },
    setTrack2Input: (v: string) => {
      setTrack2Input(v);
      setTrack2Error(null);
    },
    track1Error,
    track2Error,
    canProceed,
    handleNext,
    handleSkip,
  };
}
