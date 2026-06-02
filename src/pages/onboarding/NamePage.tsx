import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { colors } from '../../styles/colors';
import { useNameViewModel } from '../../hooks/useNameViewModel';

type Props = StackScreenProps<OnboardingStackParamList, 'Name'>;

export function NamePage({ navigation }: Props) {
  const vm = useNameViewModel(navigation);

  return (
    <View style={styles.screen}>
      <View style={styles.headerSpacer} />

      <View style={styles.content}>
        <ProgressBar progress={0.07} />

        <Text style={styles.title}>
          <Text style={styles.titleHighlight}>이름</Text>을 알려주세요
        </Text>
        <Text style={styles.subtitle}>맞춤 추천에 사용됩니다.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>이름</Text>
          <TextInput
            style={[styles.input, vm.nameError ? styles.inputError : null]}
            placeholder="이름을 입력하세요"
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
        </View>
      </View>

      <View style={styles.bottomArea}>
        <Button
          title="다음 단계로"
          variant={vm.canProceed ? 'primary' : 'disabled'}
          onPress={vm.handleNext}
          subtitle={vm.canProceed ? undefined : '이름을 입력해주세요'}
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
  headerSpacer: {
    minHeight: 44,
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
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textStrong,
  },
  input: {
    height: 52,
    backgroundColor: colors.inputSurface,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.stageCap,
    backgroundColor: '#FFF5F5',
  },
  errorSlot: {
    height: 18,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 12,
    color: colors.stageCap,
    fontWeight: '500',
  },
  bottomArea: {
    paddingTop: 12,
  },
});
