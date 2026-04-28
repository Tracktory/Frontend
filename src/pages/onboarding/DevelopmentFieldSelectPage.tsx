import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { InterestChip } from './components/InterestChip';

type Props = StackScreenProps<OnboardingStackParamList, 'DevelopmentFieldSelect'>;

const developmentFields = [
  '웹 서비스 개발',
  '모바일 앱 개발',
  '게임 개발',
  '데이터 엔지니어링',
  '데이터 분석',
  'AI/ML 모델 개발',
  '클라우드/인프라',
  'DevOps/SRE',
  '보안 엔지니어링',
  '임베디드/IoT',
];

export function DevelopmentFieldSelectPage({ navigation }: Props) {
  const selectedFields = useOnboardingStore((state) => state.developmentFields);
  const toggleDevelopmentField = useOnboardingStore((state) => state.toggleDevelopmentField);
  const maxReached = selectedFields.length >= 3;

  const handleToggleField = (field: string) => {
    const alreadySelected = selectedFields.includes(field);
    if (!alreadySelected && maxReached) {
      console.log('[Onboarding] 개발 분야는 최대 3개까지 선택할 수 있습니다.');
      return;
    }
    toggleDevelopmentField(field);
  };

  const handleNext = () => {
    if (selectedFields.length < 1) {
      return;
    }
    console.log('[Onboarding] 선택한 개발 분야:', selectedFields);
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

        <Text style={styles.screenId}>ON-SCR-05a | ON-008</Text>
        <ProgressBar progress={0.56} />

        <Text style={styles.title}>흥미있는 개발 분야를 선택해주세요</Text>
        <Text style={styles.subtitle}>1~3개 선택 가능</Text>

        <View style={styles.chipGroup}>
          {developmentFields.map((field) => {
            const isSelected = selectedFields.includes(field);
            return (
              <InterestChip
                key={field}
                label={field}
                selected={isSelected}
                disabled={maxReached && !isSelected}
                onPress={() => handleToggleField(field)}
              />
            );
          })}
        </View>

        <Text style={styles.counterText}>선택됨: {selectedFields.length}/3</Text>
      </View>

      <View style={styles.bottomArea}>
        <Button
          title={selectedFields.length > 0 ? '다음' : '다음 (개발 분야를 선택해주세요)'}
          variant={selectedFields.length > 0 ? 'primary' : 'disabled'}
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
