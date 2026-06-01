import { useState } from 'react';
import { Alert } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { signUp, AuthApiError } from '../api/authApi';
import type { AuthStackParamList } from '../navigation/AuthNavigator';

type AuthNavigation = StackNavigationProp<AuthStackParamList, 'SignUp'>;

function validateUserName(value: string): string {
  if (!value.trim()) return '이름을 입력해주세요.';
  return '';
}

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
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [userNameError, setUserNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid =
    userName.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    confirmPassword.trim().length > 0;

  const handleUserNameBlur = () => setUserNameError(validateUserName(userName));
  const handleEmailBlur = () => setEmailError(validateEmail(email));
  const handlePasswordBlur = () => setPasswordError(validatePassword(password));
  const handleConfirmPasswordBlur = () =>
    setConfirmPasswordError(validateConfirmPassword(password, confirmPassword));

  const handleSignUp = async () => {
    const uErr = validateUserName(userName);
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    const cErr = validateConfirmPassword(password, confirmPassword);
    setUserNameError(uErr);
    setEmailError(eErr);
    setPasswordError(pErr);
    setConfirmPasswordError(cErr);
    if (uErr || eErr || pErr || cErr) return;

    setIsSubmitting(true);
    try {
      await signUp(userName, email, password);
      Alert.alert('회원가입 완료', '로그인 후 온보딩을 진행해주세요.', [
        {
          text: '확인',
          onPress: () =>
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] }),
        },
      ]);
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
            Alert.alert('오류', err.message);
        }
      } else {
        Alert.alert('네트워크 오류', '잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    userName,
    setUserName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    userNameError,
    emailError,
    passwordError,
    confirmPasswordError,
    isValid,
    isSubmitting,
    handleUserNameBlur,
    handleEmailBlur,
    handlePasswordBlur,
    handleConfirmPasswordBlur,
    handleSignUp,
  };
}
