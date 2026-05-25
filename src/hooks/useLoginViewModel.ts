import { useState } from 'react';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../navigation/AuthNavigator';
import type { RootStackParamList } from '../navigation/RootNavigator';

type AuthNavigation = StackNavigationProp<AuthStackParamList, 'Login'>;
type RootNavigation = StackNavigationProp<RootStackParamList>;

function validateEmail(value: string): string {
  if (!value.trim()) return '이메일을 입력해주세요.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '올바른 이메일 형식이 아닙니다.';
  return '';
}

function validatePassword(value: string): string {
  if (!value.trim()) return '비밀번호를 입력해주세요.';
  return '';
}

export function useLoginViewModel(
  navigation: AuthNavigation,
  rootNavigation: RootNavigation
) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const isLoginEnabled = email.trim().length > 0 && password.trim().length > 0;

  const handleEmailBlur = () => setEmailError(validateEmail(email));
  const handlePasswordBlur = () => setPasswordError(validatePassword(password));

  const handleLogin = () => {
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return;

    // TODO: API 연동 시 여기에 인증 요청 추가
    rootNavigation.navigate('Onboarding');
  };

  const handleGoToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError,
    isLoginEnabled,
    handleEmailBlur,
    handlePasswordBlur,
    handleLogin,
    handleGoToSignUp,
  };
}
