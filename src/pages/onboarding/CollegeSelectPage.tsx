import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { colors } from '../../styles/colors';
import { useCollegeSelectViewModel } from '../../hooks/useCollegeSelectViewModel';
import { COLLEGE_OPTIONS, COLLEGE_TRACK_MAP } from './data/onboardingOptions';
import { ONBOARDING_COPY } from './data/onboardingCopy';
import { getOnboardingProgress } from './data/onboardingProgress';
import { OnboardingStepLayout } from './components/OnboardingStepLayout';

type Props = StackScreenProps<OnboardingStackParamList, 'CollegeSelect'>;

export function CollegeSelectPage({ navigation }: Props) {
  const vm = useCollegeSelectViewModel(navigation);
  const affiliation = useOnboardingStore((s) => s.affiliation);
  const copy = ONBOARDING_COPY.collegeSelect;
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <OnboardingStepLayout
      progress={getOnboardingProgress('CollegeSelect', affiliation)}
      title={copy.title}
      subtitle={copy.subtitle}
      showBack
      onBack={() => navigation.goBack()}
      primaryTitle={copy.ctaPrimary}
      primaryVariant={vm.canProceed ? 'primary' : 'disabled'}
      onPrimaryPress={vm.handleNext}
      scrollable
    >
      {COLLEGE_OPTIONS.map((item) => (
        <Pressable
          key={item}
          style={({ pressed }) => [
            styles.collegeRow,
            vm.college === item && styles.collegeRowSelected,
            pressed && styles.pressed,
          ]}
          onPress={() => vm.setCollege(item)}
        >
          <Text style={[styles.collegeLabel, vm.college === item && styles.collegeLabelSelected]}>
            {item}
          </Text>
        </Pressable>
      ))}

      {vm.college && (COLLEGE_TRACK_MAP[vm.college]?.length ?? 0) > 0 ? (
        <View style={styles.previewSection}>
          <Pressable onPress={() => setPreviewOpen((prev) => !prev)}>
            <Text style={styles.previewToggle}>
              {previewOpen ? '트랙 미리보기 닫기' : '이 단과대 트랙 미리보기'}
            </Text>
          </Pressable>
          {previewOpen ? (
            <View style={styles.chipRow}>
              {(COLLEGE_TRACK_MAP[vm.college] ?? []).map((track) => (
                <View key={track} style={styles.trackChip}>
                  <Text style={styles.trackChipLabel}>{track}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  collegeRow: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: colors.selectSurface,
  },
  collegeRowSelected: {
    backgroundColor: colors.selectSurfaceActive,
  },
  collegeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  collegeLabelSelected: {
    color: colors.primary,
  },
  pressed: {
    opacity: 0.92,
  },
  previewSection: {
    marginTop: 4,
  },
  previewToggle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trackChip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  trackChipLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
