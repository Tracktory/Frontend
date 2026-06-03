import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { Button } from '@/src/components/Button';
import Logo from '@/src/assets/images/Logo.svg';
import { colors } from '@/src/styles/colors';
import { useLoginViewModel } from '@/src/hooks/useLoginViewModel';
import type { AuthStackParamList } from '@/src/navigation/AuthNavigator';
import type { RootStackParamList } from '@/src/navigation/RootNavigator';

type Props = StackScreenProps<AuthStackParamList, 'Login'>;

const AUTH_BG = '#F0FDFA';

export function LoginPage({ navigation }: Props) {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const vm = useLoginViewModel(navigation, rootNavigation);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.flex}>
        <View style={styles.screen}>
          {/* 로고 영역 */}
          <View style={styles.logoArea}>
            <Logo width={100} height={88} />
            <Text style={styles.logoTitle}>Tracktory</Text>
            <Text style={styles.logoSubtitle}>나만의 AI 학습경로 추천</Text>
          </View>

          {/* 입력 영역 */}
          <View style={styles.formArea}>
            {/* 이메일 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>이메일</Text>
              <TextInput
                style={[styles.input, vm.emailError ? styles.inputError : null]}
                placeholder="이메일을 입력하세요"
                placeholderTextColor={colors.textHint}
                value={vm.email}
                onChangeText={vm.setEmail}
                onBlur={vm.handleEmailBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!vm.isSubmitting}
              />
              {/* 고정 높이 에러 슬롯 — 에러 유무와 무관하게 항상 공간 확보 */}
              <View style={styles.errorSlot}>
                {vm.emailError ? (
                  <Text style={styles.errorText}>{vm.emailError}</Text>
                ) : null}
              </View>
            </View>

            {/* 비밀번호 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>비밀번호</Text>
              <TextInput
                style={[styles.input, vm.passwordError ? styles.inputError : null]}
                placeholder="비밀번호를 입력하세요"
                placeholderTextColor={colors.textHint}
                value={vm.password}
                onChangeText={vm.setPassword}
                onBlur={vm.handlePasswordBlur}
                secureTextEntry
                autoCapitalize="none"
                editable={!vm.isSubmitting}
              />
              <View style={styles.errorSlot}>
                {vm.passwordError ? (
                  <Text style={styles.errorText}>{vm.passwordError}</Text>
                ) : null}
              </View>
            </View>
          </View>

          {/* 버튼 영역 */}
          <View style={styles.bottomArea}>
            {/* 로그인 에러 슬롯 (INVALID_CREDENTIALS 등) */}
            <View style={styles.loginErrorSlot}>
              {vm.loginError ? (
                <Text style={styles.loginErrorText}>{vm.loginError}</Text>
              ) : null}
            </View>

            {vm.isSubmitting ? (
              <View style={styles.loadingBtn}>
                <ActivityIndicator color={colors.white} />
              </View>
            ) : (
              <Button
                title="로그인"
                variant={vm.isLoginEnabled ? 'primary' : 'disabled'}
                onPress={vm.handleLogin}
              />
            )}

            <View style={styles.signUpRow}>
              <Text style={styles.signUpPrompt}>계정이 없으신가요?</Text>
              <Pressable onPress={vm.handleGoToSignUp} hitSlop={8}>
                <Text style={styles.signUpLink}>회원가입</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AUTH_BG,
  },
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },
  logoArea: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
    gap: 8,
  },
  logoTitle: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  logoSubtitle: {
    marginTop: 8,
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  formArea: {
    flex: 1,
    gap: 4,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textStrong,
  },
  input: {
    height: 52,
    backgroundColor: colors.inputSurface,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.stageCap,
    backgroundColor: '#FFF5F5',
  },
  /** 에러 슬롯: 항상 height 18을 점유해 레이아웃 이동 방지 */
  errorSlot: {
    height: 18,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 12,
    color: colors.stageCap,
    fontWeight: '500',
  },
  bottomArea: {
    gap: 16,
    paddingTop: 8,
  },
  loginErrorSlot: {
    minHeight: 20,
    alignItems: 'center',
  },
  loginErrorText: {
    fontSize: 13,
    color: colors.stageCap,
    fontWeight: '500',
    textAlign: 'center',
  },
  loadingBtn: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  signUpPrompt: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});
