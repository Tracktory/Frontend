import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useTrack1SelectViewModel } from '../../hooks/useTrack1SelectViewModel';
import { ONBOARDING_COPY } from './data/onboardingCopy';
import { getOnboardingProgress } from './data/onboardingProgress';
import { OnboardingStepLayout } from './components/OnboardingStepLayout';
import {
  OnboardingStepTitle,
  OnboardingTitleHighlight,
} from './components/OnboardingStepTitle';
import { TrackTextInputForm } from './components/TrackTextInputForm';

type Props = StackScreenProps<OnboardingStackParamList, 'Track1Select'>;

export function Track1SelectPage({ navigation }: Props) {
  const vm = useTrack1SelectViewModel(navigation);
  const grade = useOnboardingStore((s) => s.grade);
  const copy = ONBOARDING_COPY.track1Select;

  return (
    <OnboardingStepLayout
      progress={getOnboardingProgress('Track1Select', grade)}
      title={
        <OnboardingStepTitle>
          <OnboardingTitleHighlight>1·2트랙</OnboardingTitleHighlight>을 알려주세요
        </OnboardingStepTitle>
      }
      subtitle={copy.subtitle}
      showBack
      onBack={() => navigation.goBack()}
      primaryTitle={copy.ctaPrimary}
      primaryVariant={vm.canProceed ? 'primary' : 'disabled'}
      onPrimaryPress={vm.handleNext}
      secondaryTitle={copy.ctaSecondary}
      onSecondaryPress={vm.handleSkip}
      scrollable
    >
      <TrackTextInputForm
        track1Input={vm.track1Input}
        track2Input={vm.track2Input}
        onTrack1Change={vm.setTrack1Input}
        onTrack2Change={vm.setTrack2Input}
        track1Error={vm.track1Error}
        track2Error={vm.track2Error}
      />
    </OnboardingStepLayout>
  );
}
