import type { JobRecommendation } from '../../../data/mockRecommendData';
import type { RecommendationReportData } from '../../../api/recommendReportApi';
import {
  type AIActionItem,
  type RemainingCoursePlan,
  type SkillComparison,
  type SkillTokenItem,
} from '../data/analysisReportStaticMock';
import type { ReportJobItem } from './buildAnalysisReportModel';

const STAGE_LABEL: Record<string, string> = {
  FOUNDATION: '기초',
  CORE: '핵심',
  APPLIED: '응용',
  INDUSTRY: '산학',
};

const TYPE_LABEL: Record<string, string> = {
  BASIC: '전공기초',
  REQUIRED: '전공필수',
  ELECTIVE: '전공선택',
};

export function formatAnchorJobLabel(anchorJob: RecommendationReportData['anchorJob']): string | null {
  if (!anchorJob?.name) return null;
  return `${anchorJob.name} 직무 기준`;
}

export function isPrimaryAnchorReport(report: RecommendationReportData): boolean {
  const { coverage } = report;
  return coverage.nextActionsPercent > coverage.currentPercent || report.nextActions.length > 0;
}

/** 기준 직무 부족 역량 토큰 상위 6개 (API gapTokens / missingTokens) */
export function mapSkillTokensFromReport(
  report: RecommendationReportData,
  anchorJobCode: string | undefined,
): SkillTokenItem[] {
  const code = anchorJobCode ?? report.anchorJob?.code;
  const anchorField = code
    ? report.coverage.fields.find((f) => f.jobCode === code)
    : undefined;
  const tokens =
    anchorField && anchorField.missingTokens.length > 0
      ? anchorField.missingTokens
      : report.coverage.gapTokens;

  return tokens.slice(0, 6).map((label) => ({ label }));
}

export function mapSkillComparisonFromReport(report: RecommendationReportData): SkillComparison[] {
  return report.coverage.fields.map((f) => ({
    subject: f.jobName,
    current: f.currentPercent,
    projected: f.expectedPercent,
  }));
}

function findStoreJob(
  jobs: JobRecommendation[],
  field: { jobCode: string; jobName: string }
): JobRecommendation | undefined {
  return (
    jobs.find((j) => j.code === field.jobCode) ??
    jobs.find((j) => j.title === field.jobName)
  );
}

export function mapReportJobs(
  report: RecommendationReportData,
  storeJobs: JobRecommendation[],
  anchorJobCode: string | undefined
): ReportJobItem[] {
  const sorted = [...report.coverage.fields].sort(
    (a, b) => b.currentPercent - a.currentPercent
  );

  return sorted.map((field) => {
    const store = findStoreJob(storeJobs, field);
    const matchScore = store?.matchScore ?? field.currentPercent;

    return {
      id: field.jobCode,
      jobCode: field.jobCode,
      title: field.jobName,
      match: matchScore,
      coveragePercent: field.currentPercent,
      gapTokens: field.missingTokens.slice(0, 6),
      isAnchor: anchorJobCode === field.jobCode,
    };
  });
}

export function mapRemainingCoursePlan(
  report: RecommendationReportData,
  showContribution: boolean
): RemainingCoursePlan[] {
  return report.remainingCourses.map((c) => {
    const impact =
      showContribution && c.contributionPercent != null
        ? `+${c.contributionPercent}%`
        : '—';
    const stageLabel = STAGE_LABEL[c.stage] ?? c.stage;
    const typeLabel = TYPE_LABEL[c.type] ?? c.type;
    const trackHint = c.tracks.length > 0 ? c.tracks[0]! : '—';

    return {
      name: c.name,
      credits: c.credit,
      impact,
      sem: stageLabel,
      area: typeLabel,
      code: c.code,
      tracks: c.tracks,
      trackHint,
      contributionPercent: c.contributionPercent,
    };
  });
}

export function mapNextActions(report: RecommendationReportData): AIActionItem[] {
  return report.nextActions.map((a) => ({
    icon: '📌',
    text: a.message,
  }));
}

export function assertCoverageInvariant(report: RecommendationReportData): void {
  const { coverage } = report;
  if (__DEV__) {
    const ok =
      coverage.currentCovered <= coverage.nextActionsCovered &&
      coverage.nextActionsCovered <= coverage.expectedCovered;
    if (!ok) {
      console.warn('[report] coverage invariant violated', {
        current: coverage.currentCovered,
        next: coverage.nextActionsCovered,
        expected: coverage.expectedCovered,
      });
    }
  }
}
