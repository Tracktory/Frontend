import { useState } from 'react';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { OnboardingStackParamList } from '../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../stores/onboardingStore';

type Navigation = StackNavigationProp<OnboardingStackParamList, 'Name'>;

function validateName(value: string): string {
  if (!value.trim()) return '이름을 입력해주세요.';
  return '';
}

export function useNameViewModel(navigation: Navigation) {
  const storedName = useOnboardingStore((s) => s.name);
  const setName = useOnboardingStore((s) => s.setName);

  const [name, setLocalName] = useState(storedName);
  const [nameError, setNameError] = useState('');

  const canProceed = name.trim().length > 0;

  const handleNameBlur = () => setNameError(validateName(name));

  const handleNext = () => {
    const err = validateName(name);
    setNameError(err);
    if (err) return;

    setName(name);
    navigation.navigate('AdmissionYear');
  };

  return {
    name,
    setName: setLocalName,
    nameError,
    canProceed,
    handleNameBlur,
    handleNext,
  };
}
