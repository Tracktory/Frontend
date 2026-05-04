import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { colors } from '../../styles/colors';
import { useAffiliationViewModel } from '../../hooks/useAffiliationViewModel';
import { AffiliationCard } from './components/AffiliationCard';

type Props = StackScreenProps<OnboardingStackParamList, 'Affiliation'>;

export function AffiliationPage({ navigation }: Props) {
  const vm = useAffiliationViewModel(navigation);

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <ProgressBar progress={0.28} />

        <Text style={styles.title}>
          <Text style={styles.titleHighlight}>소속</Text>을 선택해주세요
        </Text>
        <Text style={styles.subtitle}>{vm.subtitle}</Text>

        <AffiliationCard
          title="1학년 신입생"
          selected={vm.affiliation === '1학년'}
          onPress={() => vm.setAffiliation('1학년')}
        />
        <AffiliationCard
          title="2학년 이상 재학생"
          selected={vm.affiliation === '2학년이상'}
          onPress={() => vm.setAffiliation('2학년이상')}
        />
      </View>

      <View style={styles.bottomArea}>
        <Button
          title="다음 단계로"
          variant={vm.canProceed ? 'primary' : 'disabled'}
          onPress={vm.handleNext}
          subtitle={vm.canProceed ? undefined : '소속을 선택해주세요'}
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
