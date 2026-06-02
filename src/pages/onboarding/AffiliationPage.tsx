import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { colors } from '../../styles/colors';
import { useAffiliationViewModel } from '../../hooks/useAffiliationViewModel';
import { ONBOARDING_COPY } from './data/onboardingCopy';
import { getOnboardingProgress } from './data/onboardingProgress';
import { OnboardingStepLayout } from './components/OnboardingStepLayout';

type Props = StackScreenProps<OnboardingStackParamList, 'Affiliation'>;

export function AffiliationPage({ navigation }: Props) {
  const vm = useAffiliationViewModel(navigation);
  const affiliation = useOnboardingStore((s) => s.affiliation);
  const copy = ONBOARDING_COPY.affiliation;
  const subtitle = vm.subtitle || copy.subtitle;

  return (
    <OnboardingStepLayout
      progress={getOnboardingProgress('Affiliation', affiliation)}
      title={copy.title}
      subtitle={subtitle}
      showBack
      onBack={() => navigation.goBack()}
      primaryTitle={copy.ctaPrimary}
      primaryVariant={vm.canProceed ? 'primary' : 'disabled'}
      primarySubtitle={vm.canProceed ? undefined : copy.ctaDisabledHint}
      onPrimaryPress={vm.handleNext}
    >
      <Pressable
        style={({ pressed }) => [
          styles.option,
          vm.affiliation === '1학년' && styles.optionSelected,
          pressed && styles.pressed,
        ]}
        onPress={() => vm.setAffiliation('1학년')}
      >
        <Text
          style={[
            styles.optionText,
            vm.affiliation === '1학년' && styles.optionTextSelected,
          ]}
        >
          1학년이에요 (트랙 아직 안 정함)
        </Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.option,
          vm.affiliation === '2학년이상' && styles.optionSelected,
          pressed && styles.pressed,
        ]}
        onPress={() => vm.setAffiliation('2학년이상')}
      >
        <Text
          style={[
            styles.optionText,
            vm.affiliation === '2학년이상' && styles.optionTextSelected,
          ]}
        >
          2학년 이상 (트랙 1·2 있음)
        </Text>
      </Pressable>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  option: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 22,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: colors.selectSurface,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: colors.selectSurfaceActive,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: colors.primary,
  },
  pressed: {
    opacity: 0.92,
  },
});
