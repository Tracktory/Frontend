import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { colors } from '../../styles/colors';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { YearSelectButton } from './components/YearSelectButton';

type Props = StackScreenProps<OnboardingStackParamList, 'AdmissionYear'>;

const admissionYears = [2024, 2025, 2026];

export function AdmissionYearPage({ navigation }: Props) {
  const admissionYear = useOnboardingStore((state) => state.admissionYear);
  const setAdmissionYear = useOnboardingStore((state) => state.setAdmissionYear);

  const isYearSelected = admissionYear !== null;

  const handleNext = () => {
    if (!isYearSelected) return;
    navigation.navigate('Affiliation');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.screenLabel}>온보딩</Text>
        <ProgressBar progress={0.14} />
        <Text style={styles.title}>입학년도를 선택해주세요</Text>
        <Text style={styles.subtitle}>학년을 자동으로 산출합니다.</Text>

        {admissionYears.map((year) => (
          <YearSelectButton
            key={year}
            year={year}
            selected={admissionYear === year}
            onPress={() => setAdmissionYear(year)}
          />
        ))}
      </View>

      <View style={styles.bottomArea}>
        <Button
          title="다음 단계로"
          variant={isYearSelected ? 'primary' : 'disabled'}
          onPress={handleNext}
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
    paddingTop: 64,
    paddingBottom: 28,
  },
  content: {
    flex: 1,
  },
  screenLabel: {
    fontSize: 12,
    color: colors.textHint,
    marginBottom: 8,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
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
