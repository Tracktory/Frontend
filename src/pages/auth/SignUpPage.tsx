import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '@/src/components/Button';
import Logo from '@/src/assets/images/Logo.svg';
import { colors } from '@/src/styles/colors';
import { useSignUpViewModel } from '@/src/hooks/useSignUpViewModel';
import type { AuthStackParamList } from '@/src/navigation/AuthNavigator';

type Props = StackScreenProps<AuthStackParamList, 'SignUp'>;

const AUTH_BG = '#F0FDFA';

export function SignUpPage({ navigation }: Props) {
  const vm = useSignUpViewModel(navigation);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.flex}>
        <View style={styles.screen}>
          <View style={styles.logoArea}>
            <Logo width={100} height={88} />
            <Text style={styles.logoTitle}>Tracktory</Text>
            <Text style={styles.logoSubtitle}>나만의 AI 학습경로 추천</Text>
          </View>

          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.formScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formArea}>
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
                <View style={styles.errorSlot}>
                  {vm.emailError ? (
                    <Text style={styles.errorText}>{vm.emailError}</Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>비밀번호</Text>
                <TextInput
                  style={[styles.input, vm.passwordError ? styles.inputError : null]}
                  placeholder="8~64자, 영문·숫자·특수문자 각 1개 이상"
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

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>비밀번호 확인</Text>
                <TextInput
                  style={[styles.input, vm.confirmPasswordError ? styles.inputError : null]}
                  placeholder="비밀번호를 다시 입력하세요"
                  placeholderTextColor={colors.textHint}
                  value={vm.confirmPassword}
                  onChangeText={vm.setConfirmPassword}
                  onBlur={vm.handleConfirmPasswordBlur}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!vm.isSubmitting}
                />
                <View style={styles.errorSlot}>
                  {vm.confirmPasswordError ? (
                    <Text style={styles.errorText}>{vm.confirmPasswordError}</Text>
                  ) : null}
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.bottomArea}>
            <View style={styles.submitErrorSlot} />

            {vm.isSubmitting ? (
              <View style={styles.loadingBtn}>
                <ActivityIndicator color={colors.white} />
              </View>
            ) : (
              <Button
                title="회원가입"
                variant={vm.isValid ? 'primary' : 'disabled'}
                onPress={vm.handleSignUp}
              />
            )}

            <View style={styles.loginRow}>
              <Text style={styles.loginPrompt}>이미 계정이 있으신가요?</Text>
              <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
                <Text style={styles.loginLink}>로그인</Text>
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
  formScroll: {
    flex: 1,
  },
  formScrollContent: {
    flexGrow: 1,
  },
  formArea: {
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
  submitErrorSlot: {
    minHeight: 20,
    alignItems: 'center',
  },
  loadingBtn: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  loginPrompt: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});
