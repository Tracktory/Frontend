import type { ChatMessage } from '../stores/chatStore';

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

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
