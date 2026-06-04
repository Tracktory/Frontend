import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { colors } from '../../styles/colors';
import { useExperiencedFieldViewModel } from '../../hooks/useExperiencedFieldViewModel';
import { InterestChip } from './components/InterestChip';
import { TECH_TAG_OPTIONS } from './data/onboardingOptions';
import { ONBOARDING_COPY } from './data/onboardingCopy';
import { getOnboardingProgress } from './data/onboardingProgress';
import { OnboardingStepLayout } from './components/OnboardingStepLayout';
import {
  OnboardingStepTitle,
  OnboardingTitleHighlight,
} from './components/OnboardingStepTitle';

type Props = StackScreenProps<OnboardingStackParamList, 'GoalSelect'>;

export function ExperiencedFieldPage({ navigation }: Props) {
  const vm = useExperiencedFieldViewModel(navigation);
  const grade = useOnboardingStore((s) => s.grade);
  const copy = ONBOARDING_COPY.experiencedField;

  return (
    <OnboardingStepLayout
      progress={getOnboardingProgress('GoalSelect', grade)}
      title={
        <OnboardingStepTitle>
          미리 해본 <OnboardingTitleHighlight>기술</OnboardingTitleHighlight>이 있나요?
        </OnboardingStepTitle>
      }
      subtitle={copy.subtitle}
      showBack
      onBack={() => navigation.goBack()}
      primaryTitle={copy.ctaPrimary}
      onPrimaryPress={vm.handleNext}
      secondaryTitle={copy.ctaSecondary}
      onSecondaryPress={vm.handleSkip}
      scrollable
    >
      <TextInput
        style={styles.textInput}
        placeholder="예: Python, React, 데이터분석"
        placeholderTextColor={colors.textHint}
        value={vm.fieldInput}
        onChangeText={vm.setExperiencedFieldInput}
        returnKeyType="done"
      />
      <Text style={styles.tagHint}>자유 입력 또는 아래 태그 선택</Text>
      <View style={styles.chipGroup}>
        {TECH_TAG_OPTIONS.map((tag) => {
          const isSelected = vm.selectedFields.includes(tag);
          return (
            <InterestChip
              key={tag}
              label={tag}
              selected={isSelected}
              onPress={() => vm.toggleExperiencedField(tag)}
            />
          );
        })}
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 0,
    paddingVertical: 14,
    fontSize: 16,
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
});
