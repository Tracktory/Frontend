import type { AffiliationType } from '../../../stores/slices/admissionSlice';

export type OnboardingRouteName =
  | 'Name'
  | 'AdmissionYear'
  | 'Affiliation'
  | 'CollegeSelect'
  | 'Track1Select'
  | 'Track2Select'
  | 'InterestSelect'
  | 'DevelopmentFieldSelect'
  | 'CompanyTypeSelect'
  | 'EmploymentValueSelect'
  | 'GoalSelect'
  | 'OnboardingConfirm';

const FIRST_YEAR_STEPS: OnboardingRouteName[] = [
  'Name',
  'AdmissionYear',
  'Affiliation',
  'CollegeSelect',
  'InterestSelect',
  'DevelopmentFieldSelect',
  'CompanyTypeSelect',
  'EmploymentValueSelect',
  'GoalSelect',
  'OnboardingConfirm',
];

const UPPER_YEAR_STEPS: OnboardingRouteName[] = [
  'Name',
  'AdmissionYear',
  'Affiliation',
  'Track1Select',
  'Track2Select',
  'InterestSelect',
  'DevelopmentFieldSelect',
  'CompanyTypeSelect',
  'EmploymentValueSelect',
  'GoalSelect',
  'OnboardingConfirm',
];

export function getOnboardingProgress(
  route: OnboardingRouteName,
  affiliation: AffiliationType | null
): number {
  const steps =
    affiliation === '2학년이상' ? UPPER_YEAR_STEPS : FIRST_YEAR_STEPS;
  const index = steps.indexOf(route);
  if (index < 0) {
    return 0.5;
  }
  return (index + 1) / steps.length;
}
