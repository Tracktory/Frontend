import { useEffect, useMemo } from 'react';
import type { StackNavigationProp } from '@react-navigation/stack';

import {
  COMPANY_TYPE_OPTIONS,
  EMPLOYMENT_VALUE_OPTIONS,
} from '../pages/onboarding/data/onboardingOptions';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../stores/onboardingStore';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'EmploymentPreference'>;

export function useEmploymentPreferenceViewModel(navigation: Navigation) {
  const rawCompanyTypes = useOnboardingStore((s) => s.preferredCompanyTypes);
  const togglePreferredCompanyType = useOnboardingStore((s) => s.togglePreferredCompanyType);
  const rawEmploymentValues = useOnboardingStore((s) => s.employmentValues);
  const toggleEmploymentValue = useOnboardingStore((s) => s.toggleEmploymentValue);
  const setEmploymentValues = useOnboardingStore((s) => s.setEmploymentValues);

  const validCompanyTypeSet = useMemo(() => new Set(COMPANY_TYPE_OPTIONS), []);
  const validEmploymentValueSet = useMemo(() => new Set(EMPLOYMENT_VALUE_OPTIONS), []);

  const selectedCompanyTypes = useMemo(
    () => rawCompanyTypes.filter((type) => validCompanyTypeSet.has(type)),
    [rawCompanyTypes, validCompanyTypeSet]
  );

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
  const canProceed = selectedCompanyTypes.length >= 1 && selectedValues.length >= 1;

  const handleToggleCompanyType = (type: string) => {
    togglePreferredCompanyType(type);
  };

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
    selectedCompanyTypes,
    selectedValues,
    valuesMaxReached,
    canProceed,
    handleToggleCompanyType,
    handleToggleValue,
    handleNext,
  };
}
