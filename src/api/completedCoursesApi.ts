import { AuthApiError } from './authApi';

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string; details: unknown } | null;
}

export interface AddCompletedCourseRequestBody {
  subjectId: number;
  year: number;
  semester: 1 | 2;
}

export interface AddCompletedCourseResponseData {
  id: number;
  subjectId: number;
  year: number;
  semester: number;
}

export async function addCompletedCourse(
  accessToken: string,
  body: AddCompletedCourseRequestBody
): Promise<AddCompletedCourseResponseData> {
  const res = await fetch(`${BASE_URL}/api/v1/subjects/completed-courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const envelope: ApiEnvelope<AddCompletedCourseResponseData> = await res.json();

  if (!envelope.success) {
    const code = envelope.error?.code ?? 'UNKNOWN';
    const message = envelope.error?.message ?? '알 수 없는 오류가 발생했습니다.';
    throw new AuthApiError(code, message);
  }

  if (!envelope.data) {
    throw new Error('응답 데이터가 없습니다.');
  }

  return envelope.data;
}
