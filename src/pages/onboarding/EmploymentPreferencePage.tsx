import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { InterestChip } from './components/InterestChip';
import { COMPANY_TYPE_OPTIONS, EMPLOYMENT_VALUE_OPTIONS } from './constants';

type Props = StackScreenProps<OnboardingStackParamList, 'EmploymentPreference'>;

export function EmploymentPreferencePage({ navigation }: Props) {
  const selectedCompanyTypes = useOnboardingStore((state) => state.preferredCompanyTypes);
  const togglePreferredCompanyType = useOnboardingStore(
    (state) => state.togglePreferredCompanyType
  );

  const selectedValues = useOnboardingStore((state) => state.employmentValues);
  const toggleEmploymentValue = useOnboardingStore((state) => state.toggleEmploymentValue);
  const valuesMaxReached = selectedValues.length >= 3;

  const handleToggleValue = (value: string) => {
    const alreadySelected = selectedValues.includes(value);
    if (!alreadySelected && valuesMaxReached) {
      console.log('[Onboarding] 취업 시 중요 가치는 최대 3개까지 선택할 수 있습니다.');
      return;
    }
    toggleEmploymentValue(value);
  };

  const canProceed = selectedCompanyTypes.length >= 1 && selectedValues.length >= 1;

  const handleNext = () => {
    if (!canProceed) return;
    console.log('[Onboarding] 선택한 희망 회사 유형:', selectedCompanyTypes);
    console.log('[Onboarding] 선택한 취업 시 중요 가치:', selectedValues);
    navigation.navigate('GoalSelect');
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← 뒤로</Text>
          </Pressable>
          <Text style={styles.headerTitle}>1학년 흐름</Text>
        </View>

        <Text style={styles.screenId}>ON-SCR-06a | ON-008, ON-009</Text>
        <ProgressBar progress={0.56} />

        <Text style={styles.title}>취업 선호도를 알려주세요</Text>
        <Text style={styles.subtitle}>원하는 회사 유형과 중요한 가치를 선택해주세요</Text>

        {/* 섹션 1: 희망 회사 유형 */}
        <Text style={styles.sectionLabel}>희망 회사 유형 (복수선택)</Text>
        <View style={styles.chipGroup}>
          {COMPANY_TYPE_OPTIONS.map((type) => {
            const isSelected = selectedCompanyTypes.includes(type);
            return (
              <InterestChip
                key={type}
                label={type}
                selected={isSelected}
                onPress={() => togglePreferredCompanyType(type)}
              />
            );
          })}
        </View>

        {/* 섹션 2: 취업 시 중요 가치 */}
        <Text style={styles.sectionLabel}>취업 시 중요 가치 (최대 3개)</Text>
        <View style={styles.chipGroup}>
          {EMPLOYMENT_VALUE_OPTIONS.map((value) => {
            const isSelected = selectedValues.includes(value);
            return (
              <InterestChip
                key={value}
                label={value}
                selected={isSelected}
                disabled={valuesMaxReached && !isSelected}
                onPress={() => handleToggleValue(value)}
              />
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomArea}>
        <Button
          title={canProceed ? '다음' : '다음 (회사 유형과 가치를 선택해주세요)'}
          variant={canProceed ? 'primary' : 'disabled'}
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
    paddingTop: 48,
    paddingBottom: 28,
  },
  scrollArea: {
    flex: 1,
  },
  content: {
    paddingBottom: 16,
  },
  headerRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    marginBottom: 10,
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 12,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
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
    fontSize: 18,
    lineHeight: 26,
    color: '#737373',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#404040',
    marginBottom: 12,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  bottomArea: {
    paddingTop: 12,
  },
});
