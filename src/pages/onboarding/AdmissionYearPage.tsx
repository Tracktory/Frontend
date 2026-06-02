import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { colors } from '../../styles/colors';
import { useAdmissionYearViewModel } from '../../hooks/useAdmissionYearViewModel';
import { YearSelectButton } from './components/YearSelectButton';
import { ONBOARDING_COPY } from './data/onboardingCopy';
import { getOnboardingProgress } from './data/onboardingProgress';
import { OnboardingStepLayout } from './components/OnboardingStepLayout';

type Props = StackScreenProps<OnboardingStackParamList, 'AdmissionYear'>;

const admissionYears = [2024, 2025, 2026];

export function AdmissionYearPage({ navigation }: Props) {
  const vm = useAdmissionYearViewModel(navigation);
  const affiliation = useOnboardingStore((s) => s.affiliation);
  const grade = useOnboardingStore((s) => s.grade);
  const copy = ONBOARDING_COPY.admissionYear;

  return (
    <OnboardingStepLayout
      progress={getOnboardingProgress('AdmissionYear', affiliation)}
      title={copy.title}
      subtitle={copy.subtitle}
      primaryTitle={copy.ctaPrimary}
      primaryVariant={vm.isYearSelected ? 'primary' : 'disabled'}
      onPrimaryPress={vm.handleNext}
    >
      {admissionYears.map((year) => (
        <YearSelectButton
          key={year}
          year={year}
          selected={vm.admissionYear === year}
          onPress={() => vm.setAdmissionYear(year)}
        />
      ))}
      {grade != null ? (
        <View style={styles.gradeHint}>
          <Text style={styles.gradeHintText}>지금은 {grade}학년이에요</Text>
        </View>
      ) : null}
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  gradeHint: {
    marginTop: 8,
  },
  gradeHintText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
});
