import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { colors } from '../../styles/colors';
import { useEmploymentPreferenceViewModel } from '../../hooks/useEmploymentPreferenceViewModel';
import { InterestChip } from './components/InterestChip';
import { COMPANY_TYPE_OPTIONS, EMPLOYMENT_VALUE_OPTIONS } from './data/onboardingOptions';

type Props = StackScreenProps<OnboardingStackParamList, 'EmploymentPreference'>;

export function EmploymentPreferencePage({ navigation }: Props) {
  const vm = useEmploymentPreferenceViewModel(navigation);

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProgressBar progress={0.70} />

        <Text style={styles.title}>
          <Text style={styles.titleHighlight}>취업 선호도</Text>를 알려주세요
        </Text>

        <Text style={styles.sectionLabel}>희망 회사 유형 (복수선택)</Text>
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

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>취업 시 중요 가치 (최대 3개)</Text>
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
      </ScrollView>

      <View style={styles.bottomArea}>
        <Button
          title="다음 단계로"
          variant={vm.canProceed ? 'primary' : 'disabled'}
          onPress={vm.handleNext}
          subtitle={vm.canProceed ? undefined : '취업 선호도를 선택해주세요'}
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
  headerRow: {
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: 4,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  scrollArea: {
    flex: 1,
  },
  content: {
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 24,
  },
  titleHighlight: {
    color: colors.primary,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: 20,
  },
  bottomArea: {
    paddingTop: 12,
  },
});
