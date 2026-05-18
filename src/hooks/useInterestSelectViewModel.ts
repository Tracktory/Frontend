import { useEffect, useMemo } from 'react';
import type { StackNavigationProp } from '@react-navigation/stack';

import { INTEREST_OPTIONS } from '../pages/onboarding/data/onboardingOptions';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../stores/onboardingStore';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'InterestSelect'>;

export function useInterestSelectViewModel(navigation: Navigation) {
  const rawInterests = useOnboardingStore((s) => s.interests);
  const toggleInterest = useOnboardingStore((s) => s.toggleInterest);
  const setInterests = useOnboardingStore((s) => s.setInterests);

  const validInterestSet = useMemo(() => new Set(INTEREST_OPTIONS), []);
  const interests = useMemo(
    () => rawInterests.filter((interest) => validInterestSet.has(interest)),
    [rawInterests, validInterestSet]
  );

  useEffect(() => {
    if (interests.length !== rawInterests.length) {
      setInterests(interests);
    }
  }, [interests, rawInterests, setInterests]);

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
