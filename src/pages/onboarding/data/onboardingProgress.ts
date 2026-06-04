export type OnboardingRouteName =
  | 'Name'
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
  grade: number | null
): number {
  const steps = grade != null && grade >= 2 ? UPPER_YEAR_STEPS : FIRST_YEAR_STEPS;
  const index = steps.indexOf(route);
  if (index < 0) {
    return 0.5;
  }
  return (index + 1) / steps.length;
}
