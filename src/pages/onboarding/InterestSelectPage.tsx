import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { colors } from '../../styles/colors';
import { useInterestSelectViewModel } from '../../hooks/useInterestSelectViewModel';
import { InterestChip } from './components/InterestChip';
import { INTEREST_OPTIONS } from './data/onboardingOptions';
import { ONBOARDING_COPY } from './data/onboardingCopy';
import { getOnboardingProgress } from './data/onboardingProgress';
import { OnboardingStepLayout } from './components/OnboardingStepLayout';
import {
  OnboardingStepTitle,
  OnboardingTitleHighlight,
} from './components/OnboardingStepTitle';

type Props = StackScreenProps<OnboardingStackParamList, 'InterestSelect'>;

export function InterestSelectPage({ navigation }: Props) {
  const vm = useInterestSelectViewModel(navigation);
  const grade = useOnboardingStore((s) => s.grade);
  const copy = ONBOARDING_COPY.interestSelect;

  return (
    <OnboardingStepLayout
      progress={getOnboardingProgress('InterestSelect', grade)}
      title={
        <OnboardingStepTitle>
          요즘 <OnboardingTitleHighlight>어떤 분야</OnboardingTitleHighlight>에 눈길이 가나요?
        </OnboardingStepTitle>
      }
      subtitle={copy.subtitle}
      showBack
      onBack={() => navigation.goBack()}
      primaryTitle={copy.ctaPrimary}
      primaryVariant={vm.canProceed ? 'primary' : 'disabled'}
      onPrimaryPress={vm.handleNext}
      scrollable
    >
      <Text style={styles.counter}>{vm.interests.length}/5</Text>
      <View style={styles.chipGroup}>
        {INTEREST_OPTIONS.map((interest) => {
          const isSelected = vm.interests.includes(interest);
          return (
            <InterestChip
              key={interest}
              label={interest}
              selected={isSelected}
              disabled={vm.maxReached && !isSelected}
              onPress={() => vm.handleToggle(interest)}
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
