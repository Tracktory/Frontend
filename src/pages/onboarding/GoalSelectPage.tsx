import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { InterestChip } from './components/InterestChip';

type Props = StackScreenProps<OnboardingStackParamList, 'GoalSelect'>;

const onboardingGoals = [
  '기초 역량 쌓기',
  '포트폴리오 완성',
  '공모전/해커톤 준비',
  '인턴십 준비',
  '진로 탐색',
  '협업 경험 쌓기',
];

export function GoalSelectPage({ navigation }: Props) {
  const selectedGoals = useOnboardingStore((state) => state.onboardingGoals);
  const toggleOnboardingGoal = useOnboardingStore((state) => state.toggleOnboardingGoal);
  const maxReached = selectedGoals.length >= 2;

  const handleToggleGoal = (goal: string) => {
    const alreadySelected = selectedGoals.includes(goal);
    if (!alreadySelected && maxReached) {
      console.log('[Onboarding] 목표는 최대 2개까지 선택할 수 있습니다.');
      return;
    }
    toggleOnboardingGoal(goal);
  };

  const handleNext = () => {
    if (selectedGoals.length < 1) {
      return;
    }
    console.log('[Onboarding] 선택한 목표:', selectedGoals);
    console.log('[Onboarding] 다음 화면은 아직 미구현입니다.');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← 뒤로</Text>
          </Pressable>
          <Text style={styles.headerTitle}>1학년 흐름</Text>
        </View>

        <Text style={styles.screenId}>ON-SCR-07 | ON-010</Text>
        <ProgressBar progress={0.84} />

        <Text style={styles.title}>이번 학기 목표를 선택해주세요</Text>
        <Text style={styles.subtitle}>1~2개 선택 가능</Text>

        <View style={styles.chipGroup}>
          {onboardingGoals.map((goal) => {
            const isSelected = selectedGoals.includes(goal);
            return (
              <InterestChip
                key={goal}
                label={goal}
                selected={isSelected}
                disabled={maxReached && !isSelected}
                onPress={() => handleToggleGoal(goal)}
              />
            );
          })}
        </View>

        <Text style={styles.counterText}>선택됨: {selectedGoals.length}/2</Text>
      </View>

      <View style={styles.bottomArea}>
        <Button
          title={selectedGoals.length > 0 ? '다음' : '다음 (목표를 선택해주세요)'}
          variant={selectedGoals.length > 0 ? 'primary' : 'disabled'}
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
  content: {
    flex: 1,
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
    fontSize: 22,
    lineHeight: 30,
    color: '#737373',
    marginBottom: 20,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  counterText: {
    fontSize: 14,
    color: '#737373',
  },
  bottomArea: {
    paddingTop: 12,
  },
});
