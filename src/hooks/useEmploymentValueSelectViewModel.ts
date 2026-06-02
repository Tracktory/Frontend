import { useEffect, useMemo } from 'react';
import type { StackNavigationProp } from '@react-navigation/stack';

import { EMPLOYMENT_VALUE_OPTIONS } from '../pages/onboarding/data/onboardingOptions';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../stores/onboardingStore';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'EmploymentValueSelect'>;

export function useEmploymentValueSelectViewModel(navigation: Navigation) {
  const rawEmploymentValues = useOnboardingStore((s) => s.employmentValues);
  const toggleEmploymentValue = useOnboardingStore((s) => s.toggleEmploymentValue);
  const setEmploymentValues = useOnboardingStore((s) => s.setEmploymentValues);

  const validEmploymentValueSet = useMemo(() => new Set(EMPLOYMENT_VALUE_OPTIONS), []);

  const selectedValues = useMemo(
    () => rawEmploymentValues.filter((value) => validEmploymentValueSet.has(value)),
    [rawEmploymentValues, validEmploymentValueSet]
  );

  useEffect(() => {
    if (selectedValues.length !== rawEmploymentValues.length) {
      setEmploymentValues(selectedValues);
    }
  }, [rawEmploymentValues, selectedValues, setEmploymentValues]);

  const valuesMaxReached = selectedValues.length >= 3;
  const canProceed = selectedValues.length >= 1;

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
    selectedValues,
    valuesMaxReached,
    canProceed,
    handleToggleValue,
    handleNext,
  };
}
