import { useEffect, useMemo } from 'react';
import type { StackNavigationProp } from '@react-navigation/stack';

import { COLLEGE_OPTIONS } from '../pages/onboarding/data/onboardingOptions';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../stores/onboardingStore';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'CollegeSelect'>;

export function useCollegeSelectViewModel(navigation: Navigation) {
  const rawCollege = useOnboardingStore((s) => s.college);
  const setCollege = useOnboardingStore((s) => s.setCollege);

  const validCollegeSet = useMemo(() => new Set(COLLEGE_OPTIONS), []);
  const college = useMemo(() => {
    if (!rawCollege) return null;
    return validCollegeSet.has(rawCollege) ? rawCollege : null;
  }, [rawCollege, validCollegeSet]);

  useEffect(() => {
    if (rawCollege !== college) {
      setCollege(college);
    }
  }, [college, rawCollege, setCollege]);

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
