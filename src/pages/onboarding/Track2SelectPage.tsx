import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useTrack2SelectViewModel } from '../../hooks/useTrack2SelectViewModel';
import { ONBOARDING_COPY } from './data/onboardingCopy';
import { getOnboardingProgress } from './data/onboardingProgress';
import { OnboardingStepLayout } from './components/OnboardingStepLayout';
import { TrackSelectList } from './components/TrackSelectList';

type Props = StackScreenProps<OnboardingStackParamList, 'Track2Select'>;

export function Track2SelectPage({ navigation }: Props) {
  const vm = useTrack2SelectViewModel(navigation);
  const affiliation = useOnboardingStore((s) => s.affiliation);
  const copy = ONBOARDING_COPY.track2Select;

  return (
    <OnboardingStepLayout
      progress={getOnboardingProgress('Track2Select', affiliation)}
      title={copy.title}
      subtitle={copy.subtitle}
      showBack
      onBack={() => navigation.goBack()}
      primaryTitle={copy.ctaPrimary}
      onPrimaryPress={vm.handleNext}
      secondaryTitle={copy.ctaSecondary}
      onSecondaryPress={vm.handleSkip}
      scrollable
    >
      <TrackSelectList value={vm.track2} onSelect={vm.setTrack2} />
    </OnboardingStepLayout>
  );
}
