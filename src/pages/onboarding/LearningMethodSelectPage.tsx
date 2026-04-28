import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { InterestChip } from './components/InterestChip';

type Props = StackScreenProps<OnboardingStackParamList, 'LearningMethodSelect'>;

const learningMethods = [
  '프로젝트 실습 중심',
  '이론/개념 학습',
  '멘토링/코드리뷰',
  '스터디 그룹',
  '온라인 강의',
  '해커톤 참여',
];

export function LearningMethodSelectPage({ navigation }: Props) {
  const selectedMethods = useOnboardingStore((state) => state.learningMethods);
  const toggleLearningMethod = useOnboardingStore((state) => state.toggleLearningMethod);
  const maxReached = selectedMethods.length >= 2;

  const handleToggleMethod = (method: string) => {
    const alreadySelected = selectedMethods.includes(method);
    if (!alreadySelected && maxReached) {
      console.log('[Onboarding] 학습 방식은 최대 2개까지 선택할 수 있습니다.');
      return;
    }
    toggleLearningMethod(method);
  };

  const handleNext = () => {
    if (selectedMethods.length < 1) {
      return;
    }
    console.log('[Onboarding] 선택한 학습 방식:', selectedMethods);
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

        <Text style={styles.screenId}>ON-SCR-06 | ON-009</Text>
        <ProgressBar progress={0.7} />

        <Text style={styles.title}>선호하는 학습 방식을 선택해주세요</Text>
        <Text style={styles.subtitle}>1~2개 선택 가능</Text>

        <View style={styles.chipGroup}>
          {learningMethods.map((method) => {
            const isSelected = selectedMethods.includes(method);
            return (
              <InterestChip
                key={method}
                label={method}
                selected={isSelected}
                disabled={maxReached && !isSelected}
                onPress={() => handleToggleMethod(method)}
              />
            );
          })}
        </View>

        <Text style={styles.counterText}>선택됨: {selectedMethods.length}/2</Text>
      </View>

      <View style={styles.bottomArea}>
        <Button
          title={selectedMethods.length > 0 ? '다음' : '다음 (학습 방식을 선택해주세요)'}
          variant={selectedMethods.length > 0 ? 'primary' : 'disabled'}
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
