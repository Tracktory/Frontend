import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useCompanyTypeSelectViewModel } from '../../hooks/useCompanyTypeSelectViewModel';
import { COMPANY_TYPE_OPTIONS } from './data/onboardingOptions';
import { ONBOARDING_COPY } from './data/onboardingCopy';
import { getOnboardingProgress } from './data/onboardingProgress';
import { OnboardingStepLayout } from './components/OnboardingStepLayout';
import { InterestChip } from './components/InterestChip';

type Props = StackScreenProps<OnboardingStackParamList, 'CompanyTypeSelect'>;

export function CompanyTypeSelectPage({ navigation }: Props) {
  const vm = useCompanyTypeSelectViewModel(navigation);
  const affiliation = useOnboardingStore((s) => s.affiliation);
  const copy = ONBOARDING_COPY.companyTypeSelect;

  return (
    <OnboardingStepLayout
      progress={getOnboardingProgress('CompanyTypeSelect', affiliation)}
      title={copy.title}
      subtitle={copy.subtitle}
      showBack
      onBack={() => navigation.goBack()}
      primaryTitle={copy.ctaPrimary}
      primaryVariant={vm.canProceed ? 'primary' : 'disabled'}
      primarySubtitle={vm.canProceed ? undefined : copy.ctaDisabledHint}
      onPrimaryPress={vm.handleNext}
      scrollable
    >
      <View style={styles.chipGroup}>
        {COMPANY_TYPE_OPTIONS.map((type) => {
          const isSelected = vm.selectedCompanyTypes.includes(type);
          return (
            <InterestChip
              key={type}
              label={type}
              selected={isSelected}
              onPress={() => vm.handleToggleCompanyType(type)}
            />
          );
        })}
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
