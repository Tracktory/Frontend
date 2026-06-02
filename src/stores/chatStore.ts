/** 챗봇 대화 메시지 상태 — Zustand 순수 상태 + 원자 액션만 관리 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { create as CreateType } from 'zustand';
import type {
  createJSONStorage as CreateJSONStorageType,
  persist as PersistType,
} from 'zustand/middleware';

declare const require: (id: string) => unknown;

const { create } = require('zustand') as { create: typeof CreateType };
const { createJSONStorage, persist } = require('zustand/middleware') as {
  createJSONStorage: typeof CreateJSONStorageType;
  persist: typeof PersistType;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function userKey(userId: number): string {
  return String(userId);
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

/** 메시지 생성 헬퍼 — ViewModel에서 공유해 사용 */
export function createMessage(
  role: ChatMessage['role'],
  type: ChatMessage['type'],
  text: string,
  extra?: Pick<ChatMessage, 'chips' | 'courses'>
): ChatMessage {
  return { id: uid(), role, type, text, ...extra };
}

/** 챗봇 최초 진입(또는 리셋) 시 표시할 인사 + 선택지 칩 */
export function buildInitialMessages(): ChatMessage[] {
  return [
    createMessage('assistant', 'text', '학생님, 다음 학기 수강할 과목이 궁금한가요?'),
    createMessage(
      'assistant',
      'quickReply',
      '아래 주제 중 관심 있는 것을 선택해 보세요.',
      {
        chips: [
          { id: 'track-intro', label: '트랙 소개' },
          { id: 'next-courses', label: '다음 수강과목 추천' },
        ],
      }
    ),
  ];
}

/** 순수 상태 + 원자 액션만 보관 — 응답 생성 로직은 useChatViewModel에서 처리 */
interface ChatState {
  messages: ChatMessage[];
  /** userId별 API threadId (동일 사용자는 세션 간 재사용) */
  threadIdsByUserId: Record<string, string>;
  enterChatScreen: (userId: number) => void;
  getThreadIdForUser: (userId: number) => string | null;
  setThreadIdForUser: (userId: number, threadId: string) => void;
  resetConversationForUser: (userId: number) => void;
  clearChatForLogout: () => void;
  appendMessage: (m: ChatMessage) => void;
  setMessages: (msgs: ChatMessage[]) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: buildInitialMessages(),
      threadIdsByUserId: {},

      enterChatScreen: (_userId: number) => {
        set({ messages: buildInitialMessages() });
      },

      getThreadIdForUser: (userId: number) => {
        return get().threadIdsByUserId[userKey(userId)] ?? null;
      },

      setThreadIdForUser: (userId: number, threadId: string) => {
        set((s) => ({
          threadIdsByUserId: { ...s.threadIdsByUserId, [userKey(userId)]: threadId },
        }));
      },

      resetConversationForUser: (userId: number) => {
        set((s) => {
          const next = { ...s.threadIdsByUserId };
          delete next[userKey(userId)];
          return { messages: buildInitialMessages(), threadIdsByUserId: next };
        });
      },

      clearChatForLogout: () => {
        set({ messages: buildInitialMessages(), threadIdsByUserId: {} });
      },

      appendMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),

      setMessages: (msgs) => set({ messages: msgs }),
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ threadIdsByUserId: state.threadIdsByUserId }),
      merge: (persisted, current) => ({
        ...current,
        threadIdsByUserId:
          (persisted as Partial<ChatState> | undefined)?.threadIdsByUserId ??
          current.threadIdsByUserId,
      }),
    }
  )
);
