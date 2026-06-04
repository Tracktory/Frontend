import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useEmploymentValueSelectViewModel } from '../../hooks/useEmploymentValueSelectViewModel';
import { EMPLOYMENT_VALUE_OPTIONS } from './data/onboardingOptions';
import { ONBOARDING_COPY } from './data/onboardingCopy';
import { getOnboardingProgress } from './data/onboardingProgress';
import { colors } from '../../styles/colors';
import { OnboardingStepLayout } from './components/OnboardingStepLayout';
import { InterestChip } from './components/InterestChip';

type Props = StackScreenProps<OnboardingStackParamList, 'EmploymentValueSelect'>;

export function EmploymentValueSelectPage({ navigation }: Props) {
  const vm = useEmploymentValueSelectViewModel(navigation);
  const grade = useOnboardingStore((s) => s.grade);
  const copy = ONBOARDING_COPY.employmentValueSelect;

  return (
    <OnboardingStepLayout
      progress={getOnboardingProgress('EmploymentValueSelect', grade)}
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
      <Text style={styles.counter}>
        {vm.selectedValues.length}/3
      </Text>
      <View style={styles.chipGroup}>
        {EMPLOYMENT_VALUE_OPTIONS.map((value) => {
          const isSelected = vm.selectedValues.includes(value);
          return (
            <InterestChip
              key={value}
              label={value}
              selected={isSelected}
              disabled={vm.valuesMaxReached && !isSelected}
              onPress={() => vm.handleToggleValue(value)}
            />
          );
        })}
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  counter: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
