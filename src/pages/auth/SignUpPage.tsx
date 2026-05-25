import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/src/components/Button';
import { colors } from '@/src/styles/colors';
import { useSignUpViewModel } from '@/src/hooks/useSignUpViewModel';
import type { AuthStackParamList } from '@/src/navigation/AuthNavigator';

type Props = StackScreenProps<AuthStackParamList, 'SignUp'>;

export function SignUpPage({ navigation }: Props) {
  const vm = useSignUpViewModel();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>회원가입</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 입력 영역 */}
          <View style={styles.formArea}>
            {/* 이름 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>이름</Text>
              <TextInput
                style={[styles.input, vm.nameError ? styles.inputError : null]}
                placeholder="이름을 입력하세요"
                placeholderTextColor={colors.textHint}
                value={vm.name}
                onChangeText={vm.setName}
                onBlur={vm.handleNameBlur}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {/* 고정 높이 에러 슬롯 — 에러 유무와 무관하게 항상 공간 확보 */}
              <View style={styles.errorSlot}>
                {vm.nameError ? (
                  <Text style={styles.errorText}>{vm.nameError}</Text>
                ) : null}
              </View>
            </View>

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
              />
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
                placeholder="비밀번호를 입력하세요 (8자 이상)"
                placeholderTextColor={colors.textHint}
                value={vm.password}
                onChangeText={vm.setPassword}
                onBlur={vm.handlePasswordBlur}
                secureTextEntry
                autoCapitalize="none"
              />
              <View style={styles.errorSlot}>
                {vm.passwordError ? (
                  <Text style={styles.errorText}>{vm.passwordError}</Text>
                ) : null}
              </View>
            </View>

            {/* 비밀번호 확인 */}
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
              />
              <View style={styles.errorSlot}>
                {vm.confirmPasswordError ? (
                  <Text style={styles.errorText}>{vm.confirmPasswordError}</Text>
                ) : null}
              </View>
            </View>
          </View>

          {/* 회원가입 버튼 */}
          <View style={styles.bottomArea}>
            <Button
              title="회원가입"
              variant={vm.isValid ? 'primary' : 'disabled'}
              onPress={vm.handleSignUp}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 28,
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
    paddingTop: 16,
  },
});
