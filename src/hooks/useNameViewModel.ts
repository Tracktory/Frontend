import { useState } from 'react';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../stores/onboardingStore';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'Name'>;

const GRADE_OPTIONS = [1, 2, 3, 4] as const;

function validateName(value: string): string {
  if (!value.trim()) return '이름을 입력해주세요.';
  return '';
}

export function useNameViewModel(navigation: Navigation) {
  const storedName = useOnboardingStore((s) => s.name);
  const storedGrade = useOnboardingStore((s) => s.grade);
  const setName = useOnboardingStore((s) => s.setName);
  const setGrade = useOnboardingStore((s) => s.setGrade);

  const [name, setLocalName] = useState(storedName);
  const [grade, setLocalGrade] = useState<number | null>(storedGrade);
  const [nameError, setNameError] = useState('');

  const canProceed = name.trim().length > 0 && grade !== null;

  const handleNameBlur = () => setNameError(validateName(name));

  const handleNext = () => {
    const err = validateName(name);
    setNameError(err);
    if (err || grade === null) return;

    setName(name);
    setGrade(grade);
    navigation.navigate('Affiliation');
  };

  return {
    name,
    grade,
    gradeOptions: GRADE_OPTIONS,
    setName: setLocalName,
    setGrade: setLocalGrade,
    nameError,
    canProceed,
    handleNameBlur,
    handleNext,
  };
}
