import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
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
/** inputRow: paddingTop 10 + input 42 */
const INPUT_ROW_CORE_HEIGHT = 52;
/** 키보드 상단과 입력창 사이 미세 간격 */
const KEYBOARD_ABOVE_GAP = 1;

interface ChatContentProps {
  /** 온보딩 미완료 상태이면 true — 입력/칩 차단 */
  onboardingRequired?: boolean;
  /** 오버레이 모드일 때 헤더에 최소화·닫기 버튼 표시 */
  showMinimize?: boolean;
  showClose?: boolean;
  onMinimize?: () => void;
  onClose?: () => void;
  /** 플로팅 탭바 등 하단 여백 (키보드 닫힌 resting, 탭 챗봇) */
  bottomInset?: number;
  /** 홈 FAB 오버레이 시트 — 키보드 열릴 때 bottom에 keyboardHeight 적용 */
  overlayMode?: boolean;
}

export function ChatContent({
  onboardingRequired = false,
  showMinimize = false,
  showClose = false,
  onMinimize,
  onClose,
  bottomInset = 0,
  overlayMode = false,
}: ChatContentProps) {
  const vm = useChatViewModel();
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const userId = useAuthStore((s) => s.userId);
  const userName = useAuthStore((s) => s.userName);
  const profileName = useProfileStore((s) => s.profile?.profile.name);
  const enterChatScreen = useChatStore((s) => s.enterChatScreen);

  const keyboardVisible = keyboardHeight > 0;

  const restingBottom = overlayMode ? 0 : bottomInset;

  const inputBottom = useMemo(() => {
    if (!keyboardVisible) return restingBottom;
    // Android adjustResize shrinks the window; only add a small breathing gap above the keyboard.
    if (Platform.OS === 'android') return KEYBOARD_ABOVE_GAP;
    return keyboardHeight + KEYBOARD_ABOVE_GAP;
  }, [keyboardVisible, keyboardHeight, restingBottom]);

  const inputPaddingBottom = useMemo(() => {
    if (keyboardVisible) return 0;
    if (overlayMode) return insets.bottom;
    return 10;
  }, [keyboardVisible, overlayMode, insets.bottom]);

  const scrollPaddingBottom =
    INPUT_ROW_CORE_HEIGHT + inputPaddingBottom + inputBottom;

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
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      scrollToEnd();
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleSend = () => {
    if (onboardingRequired) return;
    void vm.handleSend();
  };

  const handleChip = (id: string, label: string) => {
    if (onboardingRequired) return;
    vm.handleChip(id, label);
  };

  return (
    <View style={styles.container}>
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
        contentContainerStyle={[
          styles.messageContent,
          { paddingBottom: scrollPaddingBottom },
        ]}
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

      <View
        style={[
          styles.inputRow,
          {
            bottom: inputBottom,
            paddingBottom: inputPaddingBottom,
          },
        ]}
      >
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
    </View>
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
    flexGrow: 1,
  },
  inputRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
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
