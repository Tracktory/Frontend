import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { YearSelectButton } from './components/YearSelectButton';

type Props = StackScreenProps<OnboardingStackParamList, 'AdmissionYear'>;

const admissionYears = [2024, 2025, 2026];

export function AdmissionYearPage({ navigation }: Props) {
  const admissionYear = useOnboardingStore((state) => state.admissionYear);
  const setAdmissionYear = useOnboardingStore((state) => state.setAdmissionYear);

  const isYearSelected = admissionYear !== null;

  useEffect(() => {
    console.log('[Render] AdmissionYearPage mounted', {
      admissionYear,
    });
  }, [admissionYear]);

  const handleNext = () => {
    if (!isYearSelected) {
      return;
    }

    navigation.navigate('Affiliation');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.screenId}>ON-SCR-01 | ON-001</Text>
        <ProgressBar progress={0.14} />
        <Text style={styles.title}>입학년도를 선택해주세요</Text>
        <Text style={styles.subtitle}>학년을 자동으로 산출합니다</Text>

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
          title={isYearSelected ? '다음' : '다음 (연도를 선택해주세요)'}
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
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 28,
  },
  content: {
    flex: 1,
  },
  screenId: {
    fontSize: 12,
    color: '#A3A3A3',
    marginBottom: 8,
    fontWeight: '500',
  },
  title: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 22,
    lineHeight: 30,
    color: '#737373',
    marginBottom: 24,
  },
  bottomArea: {
    paddingTop: 12,
  },
});
