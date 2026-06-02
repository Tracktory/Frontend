import React, { useEffect, useRef } from 'react';
import {
  Alert,
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

import { colors } from '../../styles/colors';
import { useChatViewModel } from '../../hooks/useChatViewModel';
import { ChatMessageBubble } from './ChatMessageBubble';
import { ChatTypingBubble } from './ChatTypingBubble';

interface ChatContentProps {
  /** 온보딩 미완료 상태이면 true — 입력/칩 차단 */
  onboardingRequired?: boolean;
  /** 오버레이 모드일 때 헤더에 최소화·닫기 버튼 표시 */
  showMinimize?: boolean;
  showClose?: boolean;
  onMinimize?: () => void;
  onClose?: () => void;
  /** 헤더 키보드 오프셋 (KeyboardAvoidingView용) */
  headerHeight?: number;
}

export function ChatContent({
  onboardingRequired = false,
  showMinimize = false,
  showClose = false,
  onMinimize,
  onClose,
  headerHeight = 52,
}: ChatContentProps) {
  const vm = useChatViewModel();
  const scrollRef = useRef<ScrollView>(null);

  // 메시지·로딩 말풍선 추가 시 맨 아래로 스크롤
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, [vm.messages, vm.isTyping]);

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
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI 학습경로 챗봇</Text>
        <View style={styles.headerIcons}>
          {/* 이전 대화 보기 */}
          <Pressable
            style={styles.iconBtn}
            onPress={vm.handleLoadHistory}
            hitSlop={8}
            accessibilityLabel="이전 대화 보기"
          >
            <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
          </Pressable>

          {/* 새 대화 시작 (확인 팝업 포함) */}
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

      {/* 온보딩 안내 배너 */}
      {onboardingRequired && (
        <View style={styles.onboardingBanner}>
          <Text style={styles.onboardingText}>먼저 온보딩을 완료해주세요.</Text>
        </View>
      )}

      {/* 메시지 영역 */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.messageArea}
          contentContainerStyle={styles.messageContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
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

        {/* 입력 영역 */}
        <View style={styles.inputRow}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
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
