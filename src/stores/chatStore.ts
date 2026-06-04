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

function greetingHonorific(displayName?: string | null): string {
  const trimmed = displayName?.trim();
  return trimmed ? `${trimmed}님` : '학생님';
}

/** 챗봇 최초 진입(또는 리셋) 시 표시할 인사 + 선택지 칩 */
export function buildInitialMessages(displayName?: string | null): ChatMessage[] {
  const honorific = greetingHonorific(displayName);
  return [
    createMessage('assistant', 'text', `${honorific}, 다음 학기 수강할 과목이 궁금한가요?`),
    createMessage(
      'assistant',
      'quickReply',
      '아래 주제 중 관심 있는 것을 선택해 보세요.',
      {
        chips: [
          { id: 'track-intro', label: '어떤 트랙 고르면 좋을까?' },
          { id: 'next-courses', label: '1학년 2학기에 어떤 과목 들어야 해?' },
        ],
      }
    ),
  ];
}

function syncMessagesToUser(
  messagesByUserId: Record<string, ChatMessage[]>,
  activeUserId: number | null,
  messages: ChatMessage[]
): Record<string, ChatMessage[]> {
  if (activeUserId == null) return messagesByUserId;
  return { ...messagesByUserId, [userKey(activeUserId)]: messages };
}

/** 순수 상태 + 원자 액션만 보관 — 응답 생성 로직은 useChatViewModel에서 처리 */
interface ChatState {
  messages: ChatMessage[];
  /** 현재 화면에 표시 중인 사용자 (메시지 버킷 동기화용) */
  activeUserId: number | null;
  /** userId별 대화 메시지 (탭 이탈 후 복귀 시 복원) */
  messagesByUserId: Record<string, ChatMessage[]>;
  /** userId별 API threadId (동일 사용자는 세션 간 재사용) */
  threadIdsByUserId: Record<string, string>;
  enterChatScreen: (userId: number, displayName?: string | null) => void;
  getThreadIdForUser: (userId: number) => string | null;
  setThreadIdForUser: (userId: number, threadId: string) => void;
  resetConversationForUser: (userId: number, displayName?: string | null) => void;
  clearChatForLogout: () => void;
  appendMessage: (m: ChatMessage) => void;
  setMessages: (msgs: ChatMessage[]) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: buildInitialMessages(),
      activeUserId: null,
      messagesByUserId: {},
      threadIdsByUserId: {},

      enterChatScreen: (userId: number, displayName?: string | null) => {
        const key = userKey(userId);
        const stored = get().messagesByUserId[key];
        const hasUserMessages = stored?.some((m) => m.role === 'user') ?? false;
        const messages =
          !stored || (!hasUserMessages && Boolean(displayName?.trim()))
            ? buildInitialMessages(displayName)
            : stored;
        set((s) => ({
          activeUserId: userId,
          messages,
          messagesByUserId: { ...s.messagesByUserId, [key]: messages },
        }));
      },

      getThreadIdForUser: (userId: number) => {
        return get().threadIdsByUserId[userKey(userId)] ?? null;
      },

      setThreadIdForUser: (userId: number, threadId: string) => {
        set((s) => ({
          threadIdsByUserId: { ...s.threadIdsByUserId, [userKey(userId)]: threadId },
        }));
      },

      resetConversationForUser: (userId: number, displayName?: string | null) => {
        const key = userKey(userId);
        const initial = buildInitialMessages(displayName);
        set((s) => {
          const nextThreads = { ...s.threadIdsByUserId };
          delete nextThreads[key];
          const nextMessages = { ...s.messagesByUserId, [key]: initial };
          return {
            messages: s.activeUserId === userId ? initial : s.messages,
            messagesByUserId: nextMessages,
            threadIdsByUserId: nextThreads,
          };
        });
      },

      clearChatForLogout: () => {
        set({
          messages: buildInitialMessages(),
          activeUserId: null,
          messagesByUserId: {},
          threadIdsByUserId: {},
        });
      },

      appendMessage: (m) =>
        set((s) => {
          const messages = [...s.messages, m];
          return {
            messages,
            messagesByUserId: syncMessagesToUser(
              s.messagesByUserId,
              s.activeUserId,
              messages
            ),
          };
        }),

      setMessages: (msgs) =>
        set((s) => ({
          messages: msgs,
          messagesByUserId: syncMessagesToUser(
            s.messagesByUserId,
            s.activeUserId,
            msgs
          ),
        })),
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
