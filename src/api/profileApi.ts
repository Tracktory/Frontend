import { AuthApiError } from './authApi';

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string; details: unknown } | null;
}

export interface ProfileData {
  profile: {
    studentId: string;
    currentYear: number;
    name: string;
    departmentId: number;
    profileImageUrl: string | null;
  };
  tracks: { trackId: number; name: string; trackOrder: number }[];
  interests: { id: number; code: string }[];
  devFields: { id: number; code: string }[];
  companyTypes: { id: number; code: string }[];
  workValues: { id: number; code: string }[];
  techStacks: { id: number; name: string }[];
  techStackCustoms: string[];
  completedSubjects: { subjectId: number; name: string; year: number; semester: number }[];
}

export async function fetchProfile(accessToken: string): Promise<ProfileData> {
  const res = await fetch(`${BASE_URL}/api/v1/me/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const envelope: ApiEnvelope<ProfileData> = await res.json();

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
