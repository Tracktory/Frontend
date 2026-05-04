import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { colors } from '../../styles/colors';
import { useAdmissionYearViewModel } from '../../hooks/useAdmissionYearViewModel';
import { YearSelectButton } from './components/YearSelectButton';

type Props = StackScreenProps<OnboardingStackParamList, 'AdmissionYear'>;

const admissionYears = [2024, 2025, 2026];

export function AdmissionYearPage({ navigation }: Props) {
  const vm = useAdmissionYearViewModel(navigation);

  return (
    <View style={styles.screen}>
      <View style={styles.headerSpacer} />

      <View style={styles.content}>
        <ProgressBar progress={0.14} />
        <Text style={styles.title}>
          <Text style={styles.titleHighlight}>입학년도</Text>를 선택해주세요
        </Text>
        <Text style={styles.subtitle}>학년을 자동으로 산출합니다.</Text>

        {admissionYears.map((year) => (
          <YearSelectButton
            key={year}
            year={year}
            selected={vm.admissionYear === year}
            onPress={() => vm.setAdmissionYear(year)}
          />
        ))}
      </View>

      <View style={styles.bottomArea}>
        <Button
          title="다음 단계로"
          variant={vm.isYearSelected ? 'primary' : 'disabled'}
          onPress={vm.handleNext}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 28,
  },
  headerSpacer: {
    minHeight: 44,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  titleHighlight: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  bottomArea: {
    paddingTop: 12,
  },
});
