import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { InterestChip } from './components/InterestChip';

type Props = StackScreenProps<OnboardingStackParamList, 'GoalSelect'>;

const techTags = [
  'Python',
  'Java',
  'JavaScript',
  'C/C++',
  'SQL',
  'React',
  'Spring',
  'Flutter',
];

export function GoalSelectPage({ navigation }: Props) {
  const selectedFields = useOnboardingStore((state) => state.experiencedFields);
  const toggleExperiencedField = useOnboardingStore((state) => state.toggleExperiencedField);
  const fieldInput = useOnboardingStore((state) => state.experiencedFieldInput);
  const setExperiencedFieldInput = useOnboardingStore((state) => state.setExperiencedFieldInput);

  const handleNext = () => {
    console.log('[Onboarding] 공부해본 분야 텍스트:', fieldInput);
    console.log('[Onboarding] 선택한 태그:', selectedFields);
    navigation.navigate('OnboardingConfirm');
  };

  const handleSkip = () => {
    console.log('[Onboarding] 공부해본 분야 건너뛰기');
    navigation.navigate('OnboardingConfirm');
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

        <Text style={styles.screenId}>ON-SCR-07a | ON-011-1 [P2]</Text>
        <ProgressBar progress={0.7} />

        <Text style={styles.title}>공부해본 분야가 있나요?</Text>
        <Text style={styles.subtitle}>선택사항 — 건너뛰기 가능</Text>

        <TextInput
          style={styles.textInput}
          placeholder="예: Python, React, 데이터분석 등"
          placeholderTextColor="#AAAAAA"
          value={fieldInput}
          onChangeText={setExperiencedFieldInput}
          returnKeyType="done"
        />

        <Text style={styles.tagHint}>자유 입력 또는 아래 태그 선택</Text>

        <View style={styles.chipGroup}>
          {techTags.map((tag) => {
            const isSelected = selectedFields.includes(tag);
            return (
              <InterestChip
                key={tag}
                label={tag}
                selected={isSelected}
                onPress={() => toggleExperiencedField(tag)}
              />
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomArea}>
        <Button
          title="건너뛰기"
          variant="disabled"
          onPress={handleSkip}
        />
        <View style={styles.spacer} />
        <Button
          title="다음"
          variant="primary"
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
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#171717',
    marginBottom: 12,
  },
  tagHint: {
    fontSize: 13,
    color: '#A3A3A3',
    marginBottom: 12,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  bottomArea: {
    paddingTop: 12,
  },
  spacer: {
    height: 10,
  },
});
