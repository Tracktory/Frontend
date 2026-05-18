import { useState } from 'react';
import { Alert } from 'react-native';

import { useChatStore, createMessage } from '../stores/chatStore';
import { saveChatHistory, sendFeedback } from '../api/chatApi';
import type { CourseSuggestion } from '../stores/chatStore';

const HISTORY_LIMIT = 30;

/** 칩 ID별 mock 봇 응답 정의 */
const CHIP_RESPONSES: Record<
  string,
  { type: 'text' | 'courses'; text: string; courses?: CourseSuggestion[] }
> = {
  'track-intro': {
    type: 'text',
    text: '트랙은 전공 커리큘럼을 따라 역량을 쌓는 단위입니다. 단과대·학과 안내와 졸업 요건을 함께 확인해 보세요.',
  },
  'next-courses': {
    type: 'courses',
    text: '이수 현황과 관심사를 분석한 결과, 다음 과목을 추천드려요:',
    courses: [
      { title: '데이터베이스', description: '백엔드·데이터 엔지니어 공통 필수', prereqMet: false },
      { title: '알고리즘', description: '기술면접 핵심 과목', prereqMet: true },
      { title: '빅데이터개론', description: '트랙 진입 필수', prereqMet: false },
    ],
  },
};

/** 알려지지 않은 칩에 대한 기본 응답 */
const FALLBACK_RESPONSE = '말씀 주신 내용을 바탕으로 준비 중입니다. AI 연동 후 상세 답변을 드릴 예정입니다.';

export function useChatViewModel() {
  const messages = useChatStore((s) => s.messages);
  const resetConversation = useChatStore((s) => s.resetConversation);
  const appendMessage = useChatStore((s) => s.appendMessage);
  const setMessages = useChatStore((s) => s.setMessages);

  const [inputText, setInputText] = useState('');

  /** 메시지 전송 후 서버에 히스토리 조용히 저장 (API-017, silent fail) */
  const saveHistorySilently = (updatedMessages: ReturnType<typeof useChatStore.getState>['messages']) => {
    saveChatHistory(updatedMessages);
  };

  /** 텍스트 전송. 빈 입력이면 false 반환 (View에서 경고 표시용) */
  const handleSend = (): boolean => {
    const trimmed = inputText.trim();
    if (!trimmed) return false;

    const userMsg = createMessage('user', 'text', trimmed);
    appendMessage(userMsg);
    setInputText('');

    // mock 봇 응답 (AI 연동 전 임시)
    setTimeout(() => {
      const botMsg = createMessage('assistant', 'text', FALLBACK_RESPONSE);
      appendMessage(botMsg);
      // 봇 응답까지 추가된 후 저장 — 스토어에서 최신 상태를 직접 읽음
      saveHistorySilently(useChatStore.getState().messages);
    }, 350);

    return true;
  };

  /** 선택지 칩 탭 시 호출 */
  const handleChip = (chipId: string, label: string) => {
    const userMsg = createMessage('user', 'text', label);
    appendMessage(userMsg);

    const response = CHIP_RESPONSES[chipId];
    const delay = 250;

    setTimeout(() => {
      const botMsg = response
        ? createMessage('assistant', response.type, response.text, { courses: response.courses })
        : createMessage('assistant', 'text', FALLBACK_RESPONSE);
      appendMessage(botMsg);
      saveHistorySilently(useChatStore.getState().messages);
    }, delay);
  };

  /**
   * 새 대화 시작: 1회 확인 팝업 후 초기화
   */
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

  /**
   * 이전 대화 보기: persist에 저장된 최근 30개 메시지 표시
   * - 로컬 스토어에 이미 messages가 있으면 최근 30개로 슬라이스
   * - 메시지가 없으면 안내 메시지 append
   */
  const handleLoadHistory = () => {
    const current = useChatStore.getState().messages;
    const nonInitial = current.filter((m) => m.role === 'user' || m.type === 'text');

    if (nonInitial.length === 0) {
      appendMessage(
        createMessage('assistant', 'text', '불러올 이전 대화가 없어요.')
      );
      return;
    }

    const recent = current.slice(-HISTORY_LIMIT);
    setMessages(recent);
  };

  /**
   * 피드백 전송 (API-018, silent fail)
   */
  const handleFeedback = (messageId: string, type: 'like' | 'dislike') => {
    sendFeedback(messageId, type);
  };

  return {
    messages,
    inputText,
    setInputText,
    handleSend,
    handleChip,
    handleReset,
    handleLoadHistory,
    handleFeedback,
  };
}
