import React, { useEffect, useMemo, useRef } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../styles/colors';
import { useChatViewModel } from '../../hooks/useChatViewModel';
import { useAuthStore } from '../../stores/authStore';
import { useChatStore } from '../../stores/chatStore';
import { useProfileStore } from '../../stores/profileStore';
import { ChatMessageBubble } from './ChatMessageBubble';
import { ChatTypingBubble } from './ChatTypingBubble';

const HEADER_HEIGHT = 52;

interface ChatContentProps {
  /** 온보딩 미완료 상태이면 true — 입력/칩 차단 */
  onboardingRequired?: boolean;
  /** 오버레이 모드일 때 헤더에 최소화·닫기 버튼 표시 */
  showMinimize?: boolean;
  showClose?: boolean;
  onMinimize?: () => void;
  onClose?: () => void;
  /** 플로팅 탭바 등 하단 여백 (탭 챗봇) */
  bottomInset?: number;
  /** 오버레이 시트 등 상단 safe area가 별도일 때 0 */
  includeTopInsetInOffset?: boolean;
}

export function ChatContent({
  onboardingRequired = false,
  showMinimize = false,
  showClose = false,
  onMinimize,
  onClose,
  bottomInset = 0,
  includeTopInsetInOffset = true,
}: ChatContentProps) {
  const vm = useChatViewModel();
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const userId = useAuthStore((s) => s.userId);
  const userName = useAuthStore((s) => s.userName);
  const profileName = useProfileStore((s) => s.profile?.profile.name);
  const enterChatScreen = useChatStore((s) => s.enterChatScreen);

  const keyboardVerticalOffset = useMemo(
    () => (includeTopInsetInOffset ? insets.top : 0),
    [includeTopInsetInOffset, insets.top],
  );

  const scrollToEnd = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
  };

  useEffect(() => {
    if (userId == null) return;
    const displayName = profileName?.trim() || userName?.trim() || null;
    enterChatScreen(userId, displayName);
  }, [userId, profileName, userName, enterChatScreen]);

  useEffect(() => {
    scrollToEnd();
  }, [vm.messages, vm.isTyping]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const sub = Keyboard.addListener(showEvent, scrollToEnd);
    return () => sub.remove();
  }, []);

  const handleSend = () => {
    if (onboardingRequired) return;
    const ok = vm.handleSend();
    if (!ok) {
      Alert.alert('알림', '질문을 입력해주세요.');
    }
  };

  const handleChip = (id: string, label: string) => {
    if (onboardingRequired) return;
    vm.handleChip(id, label);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI 학습경로 챗봇</Text>
        <View style={styles.headerIcons}>
          <Pressable
            style={styles.iconBtn}
            onPress={vm.handleLoadHistory}
            hitSlop={8}
            accessibilityLabel="이전 대화 보기"
          >
            <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable
            style={styles.iconBtn}
            onPress={vm.handleReset}
            hitSlop={8}
            accessibilityLabel="새 대화 시작"
          >
            <Ionicons name="refresh" size={20} color={colors.textSecondary} />
          </Pressable>

          {showMinimize && (
            <Pressable style={styles.iconBtn} onPress={onMinimize} hitSlop={8}>
              <Ionicons name="remove" size={22} color={colors.textSecondary} />
            </Pressable>
          )}
          {showClose && (
            <Pressable style={styles.iconBtn} onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      {onboardingRequired && (
        <View style={styles.onboardingBanner}>
          <Text style={styles.onboardingText}>먼저 온보딩을 완료해주세요.</Text>
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        style={styles.messageArea}
        contentContainerStyle={styles.messageContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={scrollToEnd}
      >
        {vm.messages.map((msg) => (
          <ChatMessageBubble
            key={msg.id}
            message={msg}
            onChipPress={onboardingRequired ? undefined : handleChip}
          />
        ))}
        {vm.isTyping && <ChatTypingBubble />}
      </ScrollView>

      <View style={[styles.inputRow, { paddingBottom: 10 + bottomInset }]}>
        <TextInput
          style={styles.input}
          placeholder="궁금한 점을 물어보세요..."
          placeholderTextColor={colors.textHint}
          value={vm.inputText}
          onChangeText={vm.setInputText}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          editable={!onboardingRequired && !vm.isTyping}
          multiline={false}
          onFocus={scrollToEnd}
        />
        <Pressable
          style={[styles.sendBtn, onboardingRequired && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={onboardingRequired || vm.isTyping}
        >
          <Ionicons
            name="send"
            size={18}
            color={onboardingRequired ? colors.textHint : colors.white}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    padding: 6,
  },
  onboardingBanner: {
    backgroundColor: colors.warningBackground,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.warningBorder,
  },
  onboardingText: {
    fontSize: 13,
    color: colors.warningText,
    fontWeight: '500',
    textAlign: 'center',
  },
  messageArea: {
    flex: 1,
  },
  messageContent: {
    padding: 16,
    paddingBottom: 8,
    flexGrow: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 42,
    backgroundColor: colors.inputSurface,
    borderRadius: 21,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.textPrimary,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.border,
  },
});
