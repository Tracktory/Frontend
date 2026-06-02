import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { colors } from '../../styles/colors';
import { useCollegeSelectViewModel } from '../../hooks/useCollegeSelectViewModel';
import { COLLEGE_OPTIONS, COLLEGE_TRACK_MAP } from './data/onboardingOptions';

type Props = StackScreenProps<OnboardingStackParamList, 'CollegeSelect'>;

export function CollegeSelectPage({ navigation }: Props) {
  const vm = useCollegeSelectViewModel(navigation);

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProgressBar progress={0.42} />

        <Text style={styles.title}>
          <Text style={styles.titleHighlight}>단과대</Text>를 선택해주세요
        </Text>
        <Text style={styles.subtitle}>소속 단과대의 트랙 목록을 참고용으로 표시합니다</Text>

        {COLLEGE_OPTIONS.map((item) => (
          <Pressable
            key={item}
            style={({ pressed }) => [
              styles.collegeButton,
              vm.college === item ? styles.selectedButton : styles.defaultButton,
              pressed && styles.pressed,
            ]}
            onPress={() => vm.setCollege(item)}
          >
            <Text style={[styles.collegeLabel, vm.college === item && styles.selectedLabel]}>
              {item}
            </Text>
          </Pressable>
        ))}

        {vm.college && (COLLEGE_TRACK_MAP[vm.college]?.length ?? 0) > 0 && (
          <View style={styles.trackPanel}>
            <Text style={styles.trackHeader}>💡 해당 단과대 트랙 목록</Text>
            <View style={styles.chipRow}>
              {(COLLEGE_TRACK_MAP[vm.college] ?? []).map((track) => (
                <View key={track} style={styles.trackChip}>
                  <Text style={styles.trackChipLabel}>{track}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomArea}>
        <Button
          title="다음 단계로"
          variant={vm.canProceed ? 'primary' : 'disabled'}
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
  collegeButton: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  defaultButton: {
    backgroundColor: colors.selectSurface,
  },
  selectedButton: {
    backgroundColor: colors.selectSurfaceActive,
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  pressed: {
    opacity: 0.92,
  },
  collegeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  selectedLabel: {
    color: colors.primary,
  },
  trackPanel: {
    marginTop: 4,
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.selectSurfaceActive,
  },
  trackHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trackChip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  trackChipLabel: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  bottomArea: {
    paddingTop: 12,
  },
});
