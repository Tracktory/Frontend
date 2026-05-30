import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { useChatStore, createMessage } from '../stores/chatStore';
import { sendChatMessage, sendFeedback } from '../api/chatApi';
import { AuthApiError } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import type { RootStackParamList } from '../navigation/RootNavigator';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const HISTORY_LIMIT = 30;

export function useChatViewModel() {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const messages = useChatStore((s) => s.messages);
  const threadId = useChatStore((s) => s.threadId);
  const resetConversation = useChatStore((s) => s.resetConversation);
  const appendMessage = useChatStore((s) => s.appendMessage);
  const setMessages = useChatStore((s) => s.setMessages);
  const setThreadId = useChatStore((s) => s.setThreadId);

  const accessToken = useAuthStore((s) => s.accessToken);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const callApi = async (currentThreadId: string, text: string) => {
    if (!accessToken) {
      rootNavigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
      return;
    }

    setIsTyping(true);
    try {
      const data = await sendChatMessage(currentThreadId, text, accessToken);
      const chips = data.choices.map((label, i) => ({ id: `choice-${i}`, label }));
      const botMsg =
        chips.length > 0
          ? createMessage('assistant', 'quickReply', data.message, { chips })
          : createMessage('assistant', 'text', data.message);
      appendMessage(botMsg);
    } catch (err) {
      if (err instanceof AuthApiError) {
        switch (err.code) {
          case 'AUTH_REQUIRED':
            rootNavigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
            break;
          case 'VALIDATION_FAILED':
            Alert.alert('입력 오류', '메시지가 너무 길거나 형식이 올바르지 않습니다.');
            break;
          case 'INTERNAL_SERVER_ERROR':
            Alert.alert('서비스 오류', 'AI 서비스가 일시적으로 응답하지 않습니다. 잠시 후 다시 시도해주세요.');
            break;
          default:
            Alert.alert('오류', err.message);
        }
      } else {
        Alert.alert('연결 오류', '잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (): Promise<boolean> => {
    const trimmed = inputText.trim();
    if (!trimmed || isTyping) return false;

    const userMsg = createMessage('user', 'text', trimmed);
    appendMessage(userMsg);
    setInputText('');

    const currentThreadId = threadId ?? generateUUID();
    if (!threadId) setThreadId(currentThreadId);

    await callApi(currentThreadId, trimmed);
    return true;
  };

  const handleChip = async (chipId: string, label: string) => {
    if (isTyping) return;

    const userMsg = createMessage('user', 'text', label);
    appendMessage(userMsg);

    const currentThreadId = threadId ?? generateUUID();
    if (!threadId) setThreadId(currentThreadId);

    await callApi(currentThreadId, label);
  };

  const handleReset = () => {
    Alert.alert(
      '새 대화 시작',
      '정말 초기화하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          style: 'destructive',
          onPress: () => {
            resetConversation();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleLoadHistory = () => {
    const current = useChatStore.getState().messages;
    const nonInitial = current.filter((m) => m.role === 'user' || m.type === 'text');

    if (nonInitial.length === 0) {
      appendMessage(createMessage('assistant', 'text', '불러올 이전 대화가 없어요.'));
      return;
    }

    const recent = current.slice(-HISTORY_LIMIT);
    setMessages(recent);
  };

  const handleFeedback = (messageId: string, type: 'like' | 'dislike') => {
    sendFeedback(messageId, type);
  };

  return {
    messages,
    inputText,
    setInputText,
    isTyping,
    handleSend,
    handleChip,
    handleReset,
    handleLoadHistory,
    handleFeedback,
  };
}
