/**
 * 챗봇 assistant 답변 — `.` `?` `!` 뒤 줄바꿈 (소수점 등 숫자 사이 `.` 제외)
 */
export function formatAssistantMessageText(text: string): string {
  if (!text) return text;

  return text
    .replace(/([?!])\s*/g, '$1\n')
    .replace(/(?<!\d)\.\s*/g, '.\n')
    .replace(/\n{2,}/g, '\n')
    .trimEnd();
}
