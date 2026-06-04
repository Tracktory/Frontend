import { AuthApiError } from './authApi';

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string; details: unknown } | null;
}

interface OnboardingTrack {
  trackId: number;
  trackOrder: 1 | 2;
}

interface CompletedSubject {
  subjectId: number;
  year: number;
  semester: number;
}

export interface OnboardingRequestBody {
  profile: {
    currentYear: number;
    name: string;
    departmentId: number;
  };
  tracks: OnboardingTrack[];
  interestIds: number[];
  devFieldIds: number[];
  companyTypeIds: number[];
  workValueIds: number[];
  techStackIds: number[];
  techStackCustoms: string[];
  completedSubjects?: CompletedSubject[];
}

export interface OnboardingSubmitResult {
  onboardingCompleted: boolean;
}

export async function submitOnboarding(
  body: OnboardingRequestBody,
  accessToken: string
): Promise<OnboardingSubmitResult> {
  const res = await fetch(`${BASE_URL}/api/v1/onboarding`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const envelope: ApiEnvelope<OnboardingSubmitResult> = await res.json();

  if (!envelope.success) {
    const code = envelope.error?.code ?? 'UNKNOWN';
    const message = envelope.error?.message ?? '알 수 없는 오류가 발생했습니다.';
    throw new AuthApiError(code, message, envelope.error?.details);
  }

  if (!envelope.data) {
    throw new Error('응답 데이터가 없습니다.');
  }

  return envelope.data;
}
