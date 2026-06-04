import { AuthApiError } from './authApi';

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string; details: unknown } | null;
}

export type CourseTypeCode = 'BASIC' | 'REQUIRED' | 'ELECTIVE';
export type CourseStageCode = 'FOUNDATION' | 'CORE' | 'APPLIED' | 'INDUSTRY';

export interface ReportAnchorJob {
  code: string;
  name: string;
}

export interface ReportCoverageField {
  jobCode: string;
  jobName: string;
  requiredCount: number;
  currentCovered: number;
  expectedCovered: number;
  currentPercent: number;
  expectedPercent: number;
  missingTokens: string[];
}

export interface ReportCoverage {
  requiredCount: number;
  currentCovered: number;
  nextActionsCovered: number;
  expectedCovered: number;
  currentPercent: number;
  nextActionsPercent: number;
  expectedPercent: number;
  gapTokens: string[];
  fields: ReportCoverageField[];
}

export interface ReportAggregate {
  completedCourseCount: number;
  earnedCredits: number;
}

export interface ReportRemainingCourse {
  code: string;
  name: string;
  credit: number;
  type: CourseTypeCode;
  stage: CourseStageCode;
  tracks: string[];
  contributionPercent: number | null;
}

export interface ReportNextAction {
  code: string;
  name: string;
  contributionPercent: number;
  message: string;
}

export interface RecommendationReportData {
  recommendationId: number;
  anchorJob: ReportAnchorJob | null;
  coverage: ReportCoverage;
  aggregate: ReportAggregate;
  remainingCourses: ReportRemainingCourse[];
  nextActions: ReportNextAction[];
}

export async function fetchRecommendationReport(
  accessToken: string,
  anchorJobCode?: string
): Promise<RecommendationReportData> {
  const query = anchorJobCode
    ? `?anchorJobCode=${encodeURIComponent(anchorJobCode)}`
    : '';
  const res = await fetch(`${BASE_URL}/api/v1/recommendations/report${query}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const envelope: ApiEnvelope<RecommendationReportData> = await res.json();

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
