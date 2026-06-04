import { AuthApiError } from './authApi';

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string; details: unknown } | null;
}

export interface BriefingSource {
  title: string;
  url: string;
  publishedAt: string | null;
}

export interface JobBriefing {
  code: string;
  name: string;
  headline: string;
  summary: string;
  skills: string[];
  sources: BriefingSource[];
}

export interface BriefingsResponseData {
  briefings: JobBriefing[];
}

export async function fetchJobBriefings(accessToken: string): Promise<JobBriefing[]> {
  const res = await fetch(`${BASE_URL}/api/v1/briefings`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const envelope: ApiEnvelope<BriefingsResponseData> = await res.json();

  if (!envelope.success) {
    const code = envelope.error?.code ?? 'UNKNOWN';
    const message = envelope.error?.message ?? '알 수 없는 오류가 발생했습니다.';
    throw new AuthApiError(code, message, envelope.error?.details);
  }

  if (!envelope.data) {
    throw new Error('응답 데이터가 없습니다.');
  }

  return envelope.data.briefings;
}
