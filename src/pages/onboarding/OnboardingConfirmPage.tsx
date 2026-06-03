import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { colors } from '../../styles/colors';
import { useOnboardingConfirmViewModel } from '../../hooks/useOnboardingConfirmViewModel';
import { ONBOARDING_COPY } from './data/onboardingCopy';
import { getOnboardingProgress } from './data/onboardingProgress';
import { OnboardingStepLayout } from './components/OnboardingStepLayout';
import { SaveAndRecommendButton } from './components/SaveAndRecommendButton';

type Props = StackScreenProps<OnboardingStackParamList, 'OnboardingConfirm'>;

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function ConfirmChips({ label, items }: { label: string; items: string[] }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      {items.length === 0 ? (
        <Text style={styles.empty}>선택 안 함</Text>
      ) : (
        <Text style={styles.rowValue}>{items.join(' · ')}</Text>
      )}
    </View>
  );
}

export function OnboardingConfirmPage({ navigation }: Props) {
  const vm = useOnboardingConfirmViewModel(navigation);
  const affiliation = useOnboardingStore((s) => s.affiliation);
  const copy = ONBOARDING_COPY.confirm;

  const isFirstYearAffiliation = vm.affiliation === '1학년';
  const affiliationLabel = isFirstYearAffiliation ? '소속' : '선택 트랙';
  const affiliationValue = isFirstYearAffiliation
    ? vm.college ?? '선택 안 함'
    : vm.track1
      ? `${vm.track1}${vm.track2 ? ` / ${vm.track2}` : ''}`
      : '선택 안 함';

  return (
    <OnboardingStepLayout
      progress={getOnboardingProgress('OnboardingConfirm', affiliation)}
      title={copy.title}
      subtitle={copy.subtitle}
      showBack
      onBack={() => navigation.goBack()}
      primaryTitle=""
      scrollable
      footer={<SaveAndRecommendButton onPress={vm.handleSave} isLoading={vm.isSubmitting} />}
    >
      <ConfirmRow label="이름" value={vm.name || '선택 안 함'} />
      <ConfirmRow label="학년" value={vm.gradeLabel ?? '선택 안 함'} />
      <ConfirmRow label={affiliationLabel} value={affiliationValue} />
      <ConfirmChips label="관심 분야" items={vm.interests} />
      <ConfirmChips label="개발 분야" items={vm.developmentFields} />
      <ConfirmChips label="취업 선호" items={vm.employmentChips} />
      {vm.allExperiencedFields.length > 0 ? (
        <ConfirmChips label="해본 기술" items={vm.allExperiencedFields} />
      ) : null}
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  rowLabel: {
    fontSize: 13,
    color: colors.textHint,
    marginBottom: 6,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 24,
  },
  empty: {
    fontSize: 15,
    color: colors.textHint,
  },
});
