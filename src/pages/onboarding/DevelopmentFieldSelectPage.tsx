import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { colors } from '../../styles/colors';
import { useDevelopmentFieldSelectViewModel } from '../../hooks/useDevelopmentFieldSelectViewModel';
import { InterestChip } from './components/InterestChip';
import { DEVELOPMENT_FIELD_OPTIONS } from './data/onboardingOptions';

type Props = StackScreenProps<OnboardingStackParamList, 'DevelopmentFieldSelect'>;

export function DevelopmentFieldSelectPage({ navigation }: Props) {
  const vm = useDevelopmentFieldSelectViewModel(navigation);

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <ProgressBar progress={0.56} />

        <Text style={styles.title}>
          <Text style={styles.titleHighlight}>관심분야</Text>를 선택해주세요
        </Text>
        <Text style={styles.subtitle}>최대 3개까지 선택가능</Text>

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
      </View>

      <View style={styles.bottomArea}>
        <Button
          title="다음 단계로"
          variant={vm.canProceed ? 'primary' : 'disabled'}
          onPress={vm.handleNext}
          subtitle={vm.canProceed ? undefined : '관심분야를 선택해주세요'}
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
    marginTop: 16,
    marginBottom: 8,
  },
  titleHighlight: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  bottomArea: {
    paddingTop: 12,
  },
});
