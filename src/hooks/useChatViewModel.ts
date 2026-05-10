import { useState } from 'react';

import { useChatStore, createMessage } from '../stores/chatStore';
import type { CourseSuggestion } from '../stores/chatStore';

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

  const [inputText, setInputText] = useState('');

  /** 텍스트 전송. 빈 입력이면 false 반환 (View에서 경고 표시용) */
  const handleSend = (): boolean => {
    const trimmed = inputText.trim();
    if (!trimmed) return false;

    appendMessage(createMessage('user', 'text', trimmed));
    setInputText('');

    // mock 봇 응답 (AI 연동 전 임시)
    setTimeout(() => {
      appendMessage(createMessage('assistant', 'text', FALLBACK_RESPONSE));
    }, 350);

    return true;
  };

  /** 선택지 칩 탭 시 호출 */
  const handleChip = (chipId: string, label: string) => {
    appendMessage(createMessage('user', 'text', label));

    const response = CHIP_RESPONSES[chipId];
    const delay = 250;

    if (response) {
      setTimeout(() => {
        appendMessage(
          createMessage('assistant', response.type, response.text, {
            courses: response.courses,
          })
        );
      }, delay);
    } else {
      setTimeout(() => {
        appendMessage(createMessage('assistant', 'text', FALLBACK_RESPONSE));
      }, delay);
    }
  };

  return {
    messages,
    inputText,
    setInputText,
    handleSend,
    handleChip,
    resetConversation,
  };
}
