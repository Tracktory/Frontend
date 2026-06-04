import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { colors } from '../../styles/colors';
import { useDevelopmentFieldSelectViewModel } from '../../hooks/useDevelopmentFieldSelectViewModel';
import { InterestChip } from './components/InterestChip';
import { DEVELOPMENT_FIELD_OPTIONS } from './data/onboardingOptions';
import { ONBOARDING_COPY } from './data/onboardingCopy';
import { getOnboardingProgress } from './data/onboardingProgress';
import { OnboardingStepLayout } from './components/OnboardingStepLayout';

type Props = StackScreenProps<OnboardingStackParamList, 'DevelopmentFieldSelect'>;

export function DevelopmentFieldSelectPage({ navigation }: Props) {
  const vm = useDevelopmentFieldSelectViewModel(navigation);
  const grade = useOnboardingStore((s) => s.grade);
  const copy = ONBOARDING_COPY.developmentFieldSelect;

  return (
    <OnboardingStepLayout
      progress={getOnboardingProgress('DevelopmentFieldSelect', grade)}
      title={copy.title}
      subtitle={copy.subtitle}
      showBack
      onBack={() => navigation.goBack()}
      primaryTitle={copy.ctaPrimary}
      primaryVariant={vm.canProceed ? 'primary' : 'disabled'}
      onPrimaryPress={vm.handleNext}
      scrollable
    >
      <Text style={styles.counter}>{vm.developmentFields.length}/3</Text>
      <View style={styles.chipGroup}>
        {DEVELOPMENT_FIELD_OPTIONS.map((field) => {
          const isSelected = vm.developmentFields.includes(field);
          return (
            <InterestChip
              key={field}
              label={field}
              selected={isSelected}
              disabled={vm.maxReached && !isSelected}
              onPress={() => vm.handleToggle(field)}
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
