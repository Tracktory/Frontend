import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { colors } from '../../styles/colors';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { InterestChip } from './components/InterestChip';
import { TECH_TAG_OPTIONS } from './data/onboardingOptions';

type Props = StackScreenProps<OnboardingStackParamList, 'GoalSelect'>;

export function ExperiencedFieldPage({ navigation }: Props) {
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
        <ProgressBar progress={0.84} />

        <Text style={styles.title}>
          <Text style={styles.titleHighlight}>공부해본 분야</Text>가 있나요?
        </Text>
        <Text style={styles.subtitle}>*선택사항입니다</Text>

        <TextInput
          style={styles.textInput}
          placeholder="EX) Python, React, 데이터분석 등"
          placeholderTextColor={colors.textHint}
          value={fieldInput}
          onChangeText={setExperiencedFieldInput}
          returnKeyType="done"
        />

        <Text style={styles.tagHint}>자유 입력 또는 아래 태그 선택</Text>

        <View style={styles.chipGroup}>
          {TECH_TAG_OPTIONS.map((tag) => {
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
        <Button title="건너뛰기" variant="secondary" onPress={handleSkip} />
        <View style={styles.spacer} />
        <Button title="다음 단계로" variant="primary" onPress={handleNext} />
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
    marginBottom: 8,
  },
  titleHighlight: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  tagHint: {
    fontSize: 13,
    color: colors.textHint,
    marginBottom: 12,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  bottomArea: {
    paddingTop: 12,
  },
  spacer: {
    height: 10,
  },
});
