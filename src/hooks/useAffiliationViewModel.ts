import { useOnboardingStore } from '../stores/onboardingStore';
import type { AffiliationType } from '../stores/onboardingStore';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'Affiliation'>;

export function useAffiliationViewModel(navigation: Navigation) {
  const admissionYear = useOnboardingStore((s) => s.admissionYear);
  const affiliation = useOnboardingStore((s) => s.affiliation);
  const setAffiliation = useOnboardingStore((s) => s.setAffiliation);

  const subtitle = admissionYear ? `${admissionYear}년 입학생 기준` : '';
  const canProceed = affiliation !== null;

  const handleNext = () => {
    if (!canProceed) return;
    navigation.navigate(affiliation === '1학년' ? 'CollegeSelect' : 'TrackInput');
  };

  return {
    affiliation,
    subtitle,
    canProceed,
    setAffiliation: setAffiliation as (type: AffiliationType) => void,
    handleNext,
  };
}
