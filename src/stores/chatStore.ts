/** 챗봇 전역 상태 — 오버레이 UI, 메시지 목록, 초기 인사/칩 관리 */

import type { create as CreateType } from 'zustand';

declare const require: (id: string) => unknown;

const { create } = require('zustand') as {
  create: typeof CreateType;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export type ChatQuickChip = {
  id: string;
  label: string;
};

export type CourseSuggestion = {
  title: string;
  description: string;
  /** 선수과목 충족 여부 */
  prereqMet: boolean;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  /** text: 일반 말풍선 / quickReply: 칩 포함 / courses: 추천 카드 목록 */
  type: 'text' | 'quickReply' | 'courses';
  text: string;
  chips?: ChatQuickChip[];
  courses?: CourseSuggestion[];
};

/** 챗봇 최초 진입(또는 리셋) 시 표시할 인사 + 선택지 칩 */
export function buildInitialMessages(): ChatMessage[] {
  return [
    {
      id: uid(),
      role: 'assistant',
      type: 'text',
      text: '학생님, 다음 학기 수강할 과목이 궁금한가요?',
    },
    {
      id: uid(),
      role: 'assistant',
      type: 'quickReply',
      text: '아래 주제 중 관심 있는 것을 선택해 보세요.',
      chips: [
        { id: 'track-intro', label: '트랙 소개' },
        { id: 'next-courses', label: '다음 수강과목 추천' },
      ],
    },
  ];
}

interface ChatState {
  overlayOpen: boolean;
  overlayMinimized: boolean;
  messages: ChatMessage[];
  openOverlay: () => void;
  closeOverlay: () => void;
  toggleMinimize: () => void;
  resetConversation: () => void;
  appendMessage: (m: ChatMessage) => void;
  /** 텍스트 전송. 빈 문자열이면 false 반환 (경고 트리거용) */
  sendUserText: (text: string) => boolean;
  /** 선택지 칩 탭 시 호출 */
  selectChip: (id: string, label: string) => void;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  overlayOpen: false,
  overlayMinimized: false,
  messages: buildInitialMessages(),

  openOverlay: () => set({ overlayOpen: true, overlayMinimized: false }),

  closeOverlay: () => set({ overlayOpen: false, overlayMinimized: false }),

  toggleMinimize: () => set((s) => ({ overlayMinimized: !s.overlayMinimized })),

  resetConversation: () => set({ messages: buildInitialMessages() }),

  appendMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),

  sendUserText: (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    set((s) => ({
      messages: [
        ...s.messages,
        { id: uid(), role: 'user', type: 'text', text: trimmed },
      ],
    }));

    setTimeout(() => {
      get().appendMessage({
        id: uid(),
        role: 'assistant',
        type: 'text',
        text: '말씀 주신 내용을 바탕으로 준비 중입니다. AI 연동 후 상세 답변을 드릴 예정입니다.',
      });
    }, 350);

    return true;
  },

  selectChip: (chipId: string, label: string) => {
    set((s) => ({
      messages: [
        ...s.messages,
        { id: uid(), role: 'user', type: 'text', text: label },
      ],
    }));

    if (chipId === 'track-intro') {
      setTimeout(() => {
        get().appendMessage({
          id: uid(),
          role: 'assistant',
          type: 'text',
          text: '트랙은 전공 커리큘럼을 따라 역량을 쌓는 단위입니다. 단과대·학과 안내와 졸업 요건을 함께 확인해 보세요.',
        });
      }, 250);
    } else if (chipId === 'next-courses') {
      setTimeout(() => {
        get().appendMessage({
          id: uid(),
          role: 'assistant',
          type: 'courses',
          text: '이수 현황과 관심사를 분석한 결과, 다음 과목을 추천드려요:',
          courses: [
            { title: '데이터베이스', description: '백엔드·데이터 엔지니어 공통 필수', prereqMet: false },
            { title: '알고리즘', description: '기술면접 핵심 과목', prereqMet: true },
            { title: '빅데이터개론', description: '트랙 진입 필수', prereqMet: false },
          ],
        });
      }, 250);
    }
  },
}));
