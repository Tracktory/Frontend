import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { ONBOARDING_COPY } from './data/onboardingCopy';
import { getOnboardingProgress } from './data/onboardingProgress';
import { OnboardingStepLayout } from './components/OnboardingStepLayout';
import { OnboardingSparklesHero } from './components/OnboardingSparklesHero';
import { OnboardingPreviewBlurCard } from './components/OnboardingPreviewBlurCard';

type Props = StackScreenProps<OnboardingStackParamList, 'OnboardingPreview'>;

export function OnboardingPreviewPage({ navigation }: Props) {
  const affiliation = useOnboardingStore((s) => s.affiliation);
  const copy = ONBOARDING_COPY.preview;
  const isFirstYear = affiliation === '1학년';

  const goToConfirm = () => navigation.navigate('OnboardingConfirm');

  return (
    <OnboardingStepLayout
      progress={getOnboardingProgress('OnboardingPreview', affiliation)}
      title={copy.title}
      subtitle={copy.subtitle}
      showBack
      onBack={() => navigation.goBack()}
      primaryTitle={copy.ctaPrimary}
      onPrimaryPress={goToConfirm}
      scrollable
      hideTitleBlock
      centerContent
    >
      <View style={styles.content}>
        <OnboardingSparklesHero
          variant="preview"
          title={copy.title}
          subtitle={copy.subtitle}
        />
        <OnboardingPreviewBlurCard
          isFirstYear={isFirstYear}
          onOverlayPress={goToConfirm}
        />
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
    paddingTop: 8,
  },
});
