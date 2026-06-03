import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingConfirmViewModel } from '../../hooks/useOnboardingConfirmViewModel';
import { OnboardingStepLayout } from './components/OnboardingStepLayout';
import { OnboardingSparklesHero } from './components/OnboardingSparklesHero';
import { OnboardingSummaryCard } from './components/OnboardingSummaryCard';
import { SaveAndRecommendButton } from './components/SaveAndRecommendButton';

type Props = StackScreenProps<OnboardingStackParamList, 'OnboardingConfirm'>;

export function OnboardingConfirmPage({ navigation }: Props) {
  const vm = useOnboardingConfirmViewModel(navigation);
  const displayName = vm.name.trim() || '회원';

  return (
    <OnboardingStepLayout
      progress={1}
      title=""
      showBack={false}
      primaryTitle=""
      hideProgress
      hideTitleBlock
      scrollable
      footer={
        <SaveAndRecommendButton onPress={vm.handleSave} isLoading={vm.isSubmitting} />
      }
    >
      <View style={styles.content}>
        <OnboardingSparklesHero
          variant="completion"
          title="설정 완료! 🎉"
          subtitle={`${displayName}님을 위한 AI 학습경로를`}
          subtitleLine2="생성하고 있어요"
        />
        <OnboardingSummaryCard rows={vm.summaryRows} />
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
  },
});
