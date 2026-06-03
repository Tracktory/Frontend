import { useOnboardingStore } from '../stores/onboardingStore';
import type { AffiliationType } from '../stores/onboardingStore';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'Affiliation'>;

export function useAffiliationViewModel(navigation: Navigation) {
  const grade = useOnboardingStore((s) => s.grade);
  const affiliation = useOnboardingStore((s) => s.affiliation);
  const setAffiliation = useOnboardingStore((s) => s.setAffiliation);

  const subtitle = grade != null ? `${grade}학년 기준으로 맞춤 설정할게요` : '';
  const canProceed = affiliation !== null;

  const handleNext = () => {
    if (!canProceed) return;
    navigation.navigate(affiliation === '1학년' ? 'CollegeSelect' : 'Track1Select');
  };

  return {
    affiliation,
    subtitle,
    canProceed,
    setAffiliation: setAffiliation as (type: AffiliationType) => void,
    handleNext,
  };
}
