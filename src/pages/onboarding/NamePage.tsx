import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { colors } from '../../styles/colors';
import { useNameViewModel } from '../../hooks/useNameViewModel';
import { YearSelectButton } from './components/YearSelectButton';
import { ONBOARDING_COPY } from './data/onboardingCopy';
import { getOnboardingProgress } from './data/onboardingProgress';
import { OnboardingStepLayout } from './components/OnboardingStepLayout';

type Props = StackScreenProps<OnboardingStackParamList, 'Name'>;

export function NamePage({ navigation }: Props) {
  const vm = useNameViewModel(navigation);
  const copy = ONBOARDING_COPY.name;

  const disabledHint =
    !vm.name.trim()
      ? copy.ctaDisabledHint
      : vm.grade === null
        ? copy.ctaGradeDisabledHint
        : undefined;

  return (
    <OnboardingStepLayout
      progress={getOnboardingProgress('Name', null)}
      title={copy.title}
      subtitle={copy.subtitle}
      primaryTitle={copy.ctaPrimary}
      primaryVariant={vm.canProceed ? 'primary' : 'disabled'}
      primarySubtitle={vm.canProceed ? undefined : disabledHint}
      onPrimaryPress={vm.handleNext}
    >
      <TextInput
        style={[styles.input, vm.nameError ? styles.inputError : null]}
        placeholder="이름"
        placeholderTextColor={colors.textHint}
        value={vm.name}
        onChangeText={vm.setName}
        onBlur={vm.handleNameBlur}
        autoCapitalize="words"
        autoCorrect={false}
      />
      <View style={styles.errorSlot}>
        {vm.nameError ? <Text style={styles.errorText}>{vm.nameError}</Text> : null}
      </View>
      <Text style={styles.hint}>입력한 이름은 추천 리포트에만 쓰여요</Text>

      <Text style={styles.gradeTitle}>지금 몇 학년이세요?</Text>
      <View style={styles.gradeList}>
        {vm.gradeOptions.map((option) => (
          <YearSelectButton
            key={option}
            year={option}
            label={`${option}학년`}
            selected={vm.grade === option}
            onPress={() => vm.setGrade(option)}
          />
        ))}
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 52,
    fontSize: 18,
    color: colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 0,
  },
  inputError: {
    borderBottomColor: colors.stageCap,
  },
  errorSlot: {
    minHeight: 18,
    marginTop: 6,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 12,
    color: colors.stageCap,
    fontWeight: '500',
  },
  hint: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textHint,
  },
  gradeTitle: {
    marginTop: 28,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  gradeList: {
    marginTop: 8,
  },
});
