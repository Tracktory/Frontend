import { useMemo } from 'react';
import type { StackNavigationProp } from '@react-navigation/stack';

import { COMPANY_TYPE_OPTIONS } from '../pages/onboarding/data/onboardingOptions';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../stores/onboardingStore';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'CompanyTypeSelect'>;

export function useCompanyTypeSelectViewModel(navigation: Navigation) {
  const rawCompanyTypes = useOnboardingStore((s) => s.preferredCompanyTypes);
  const togglePreferredCompanyType = useOnboardingStore((s) => s.togglePreferredCompanyType);

  const validCompanyTypeSet = useMemo(() => new Set(COMPANY_TYPE_OPTIONS), []);

  const selectedCompanyTypes = useMemo(
    () => rawCompanyTypes.filter((type) => validCompanyTypeSet.has(type)),
    [rawCompanyTypes, validCompanyTypeSet]
  );

  const canProceed = selectedCompanyTypes.length >= 1;

  const handleToggleCompanyType = (type: string) => {
    togglePreferredCompanyType(type);
  };

  const handleNext = () => {
    if (!canProceed) return;
    navigation.navigate('EmploymentValueSelect');
  };

  return {
    selectedCompanyTypes,
    canProceed,
    handleToggleCompanyType,
    handleNext,
  };
}
