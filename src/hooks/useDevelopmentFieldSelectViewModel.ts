import { useEffect, useMemo } from 'react';
import type { StackNavigationProp } from '@react-navigation/stack';

import { DEVELOPMENT_FIELD_OPTIONS } from '../pages/onboarding/data/onboardingOptions';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../stores/onboardingStore';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'DevelopmentFieldSelect'>;

export function useDevelopmentFieldSelectViewModel(navigation: Navigation) {
  const rawDevelopmentFields = useOnboardingStore((s) => s.developmentFields);
  const toggleDevelopmentField = useOnboardingStore((s) => s.toggleDevelopmentField);
  const setDevelopmentFields = useOnboardingStore((s) => s.setDevelopmentFields);

  const validOptionSet = useMemo(() => new Set(DEVELOPMENT_FIELD_OPTIONS), []);
  const developmentFields = useMemo(
    () => rawDevelopmentFields.filter((field) => validOptionSet.has(field)),
    [rawDevelopmentFields, validOptionSet]
  );

  useEffect(() => {
    if (developmentFields.length !== rawDevelopmentFields.length) {
      setDevelopmentFields(developmentFields);
    }
  }, [developmentFields, rawDevelopmentFields, setDevelopmentFields]);

  const maxReached = developmentFields.length >= 3;
  const canProceed = developmentFields.length >= 1;

  const handleToggle = (field: string) => {
    const alreadySelected = developmentFields.includes(field);
    if (!alreadySelected && maxReached) return;
    toggleDevelopmentField(field);
  };

  const handleNext = () => {
    if (!canProceed) return;
    navigation.navigate('CompanyTypeSelect');
  };

  return {
    developmentFields,
    maxReached,
    canProceed,
    handleToggle,
    handleNext,
  };
}
