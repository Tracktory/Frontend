import { useState } from 'react';
import { Alert } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { login, AuthApiError } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import type { AuthStackParamList } from '../navigation/AuthNavigator';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { resetToRecommendLoading } from '../utils/navigateToRecommendLoading';

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
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoginEnabled = email.trim().length > 0 && password.trim().length > 0;

  const handleEmailBlur = () => setEmailError(validateEmail(email));
  const handlePasswordBlur = () => setPasswordError(validatePassword(password));

  const handleLogin = async () => {
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    setLoginError('');
    if (eErr || pErr) return;

    setIsSubmitting(true);
    try {
      const data = await login(email, password);
      setAuth(data);
      if (data.onboardingCompleted) {
        resetToRecommendLoading(rootNavigation);
      } else {
        rootNavigation.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }],
        });
      }
    } catch (err) {
      if (err instanceof AuthApiError) {
        switch (err.code) {
          case 'INVALID_CREDENTIALS':
            setLoginError('이메일 또는 비밀번호가 일치하지 않습니다.');
            break;
          case 'VALIDATION_FAILED':
            Alert.alert('입력 오류', '요청 형식이 올바르지 않습니다.');
            break;
          default:
            Alert.alert('오류', err.message);
        }
      } else {
        Alert.alert('네트워크 오류', '잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
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
    loginError,
    isLoginEnabled,
    isSubmitting,
    handleEmailBlur,
    handlePasswordBlur,
    handleLogin,
    handleGoToSignUp,
  };
}
