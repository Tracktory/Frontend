import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useTrack1SelectViewModel } from '../../hooks/useTrack1SelectViewModel';
import { ONBOARDING_COPY } from './data/onboardingCopy';
import { getOnboardingProgress } from './data/onboardingProgress';
import { OnboardingStepLayout } from './components/OnboardingStepLayout';
import { TrackSelectList } from './components/TrackSelectList';

type Props = StackScreenProps<OnboardingStackParamList, 'Track1Select'>;

export function Track1SelectPage({ navigation }: Props) {
  const vm = useTrack1SelectViewModel(navigation);
  const grade = useOnboardingStore((s) => s.grade);
  const copy = ONBOARDING_COPY.track1Select;

  return (
    <OnboardingStepLayout
      progress={getOnboardingProgress('Track1Select', grade)}
      title={copy.title}
      subtitle={copy.subtitle}
      showBack
      onBack={() => navigation.goBack()}
      primaryTitle={copy.ctaPrimary}
      primaryVariant={vm.canProceed ? 'primary' : 'disabled'}
      primarySubtitle={vm.canProceed ? undefined : copy.ctaDisabledHint}
      onPrimaryPress={vm.handleNext}
      scrollable
    >
      <TrackSelectList
        value={vm.track1}
        onSelect={vm.setTrack1}
        hint="1트랙은 주전공 트랙만 가능해요"
      />
    </OnboardingStepLayout>
  );
}
