import type { ChatMessage } from '../stores/chatStore';
import { AuthApiError } from './authApi';

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string; details: unknown } | null;
}

interface ChatResponseData {
  threadId: string;
  message: string;
  choices: string[];
}

/**
 * POST /api/v1/chatbot/message
 * threadId: 새 대화 시 RN이 UUID v4 발급, 이후 재사용
 */
export async function sendChatMessage(
  threadId: string,
  message: string,
  accessToken: string
): Promise<ChatResponseData> {
  const res = await fetch(`${BASE_URL}/api/v1/chatbot/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ threadId, message }),
  });

  const envelope: ApiEnvelope<ChatResponseData> = await res.json();

  if (!envelope.success) {
    const code = envelope.error?.code ?? 'UNKNOWN';
    const msg = envelope.error?.message ?? '알 수 없는 오류가 발생했습니다.';
    throw new AuthApiError(code, msg);
  }

  return envelope.data!;
}

async function post(path: string, body: unknown): Promise<void> {
  await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`,  // 인증 연동 시 추가
    },
    body: JSON.stringify(body),
  });
}

/**
 * API-017: 채팅 히스토리 저장
 * - 최근 메시지 목록을 서버에 전송한다.
 * - 네트워크 오류 등 실패 시 throw 하지 않고 조용히 무시한다. (silent fail)
 */
export async function saveChatHistory(messages: ChatMessage[]): Promise<void> {
  try {
    await post('/api/chat/history', { messages });
  } catch {
    // 저장 실패는 UX를 방해하지 않음
  }
}

/**
 * API-018: 메시지 피드백 전송
 * - 실패 시 UX 방해 없이 조용히 무시한다.
 */
export async function sendFeedback(
  messageId: string,
  type: 'like' | 'dislike'
): Promise<void> {
  try {
    await post('/api/chat/feedback', { messageId, type });
  } catch {
    // 피드백 전송 실패는 조용히 무시
  }
}
