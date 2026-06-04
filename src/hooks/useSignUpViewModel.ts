import { useState } from 'react';
import type { StackNavigationProp } from '@react-navigation/stack';

import { signUp, AuthApiError } from '../api/authApi';
import type { AuthStackParamList } from '../navigation/AuthNavigator';

type AuthNavigation = StackNavigationProp<AuthStackParamList, 'SignUp'>;

function validateEmail(value: string): string {
  if (!value.trim()) return '이메일을 입력해주세요.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '올바른 이메일 형식이 아닙니다.';
  return '';
}

function validatePassword(value: string): string {
  if (!value.trim()) return '비밀번호를 입력해주세요.';
  const strongPw = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,64}$/;
  if (!strongPw.test(value))
    return '8~64자, 영문·숫자·특수문자를 각 1개 이상 포함해야 합니다.';
  return '';
}

function validateConfirmPassword(password: string, confirm: string): string {
  if (!confirm.trim()) return '비밀번호 확인을 입력해주세요.';
  if (password !== confirm) return '비밀번호가 일치하지 않습니다.';
  return '';
}

export function useSignUpViewModel(navigation: AuthNavigation) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid =
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    confirmPassword.trim().length > 0;

  const handleEmailBlur = () => setEmailError(validateEmail(email));
  const handlePasswordBlur = () => setPasswordError(validatePassword(password));
  const handleConfirmPasswordBlur = () =>
    setConfirmPasswordError(validateConfirmPassword(password, confirmPassword));

  const handleSignUp = async () => {
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    const cErr = validateConfirmPassword(password, confirmPassword);
    setEmailError(eErr);
    setPasswordError(pErr);
    setConfirmPasswordError(cErr);
    if (eErr || pErr || cErr) return;

    setIsSubmitting(true);
    try {
      await signUp(email, password);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (err) {
      if (err instanceof AuthApiError) {
        switch (err.code) {
          case 'EMAIL_INVALID':
            setEmailError('이메일 형식이 올바르지 않습니다.');
            break;
          case 'PASSWORD_WEAK':
            setPasswordError('8~64자, 영문·숫자·특수문자를 각 1개 이상 포함해야 합니다.');
            break;
          case 'AUTH_EMAIL_DUPLICATE':
            setEmailError('이미 등록된 이메일입니다.');
            break;
          default:
            if (__DEV__) console.warn('[signUp]', err.message);
        }
      } else if (__DEV__) {
        console.warn('[signUp] network error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    emailError,
    passwordError,
    confirmPasswordError,
    isValid,
    isSubmitting,
    handleEmailBlur,
    handlePasswordBlur,
    handleConfirmPasswordBlur,
    handleSignUp,
  };
}

