import type { JobRecommendation } from '../../../data/mockRecommendData';
import type { RecommendationReportData } from '../../../api/recommendReportApi';
import type { RoadmapPayload, SemesterStep, SemesterTiming } from '../../../data/mockRoadmapData';
import type { TrackRecommendPayload } from '../../../data/mockTrackRecommendData';
import { admissionYearFromStudentId } from '../../../utils/mapProfileToOnboarding';
import { applyStudentGradeToSemesterSteps } from '../../../utils/roadmapTiming';
import {
  AI_ACTIONS,
  JOB_REPORT_ENRICHMENT,
  PREREQUISITE_WARNING_FALLBACK,
  REMAINING_COURSE_PLAN,
  SKILL_COMPARISON,
  SKILL_RADAR,
  TRACK_BARS_FALLBACK,
  type AIActionItem,
  type JobReportEnrichment,
  type RemainingCoursePlan,
  type SkillComparison,
  type SkillRadarPoint,
  type TrackBarItem,
} from '../data/analysisReportStaticMock';
import {
  computeCompetencyFromRoadmap,
  computeRoadmapProgressStats,
} from './journeyCompetency';
import {
  assertCoverageInvariant,
  formatAnchorJobLabel,
  isPrimaryAnchorReport,
  mapNextActions,
  mapRemainingCoursePlan,
  mapReportJobs,
  mapSkillComparisonFromReport,
  mapSkillRadarFromReport,
} from './mapRecommendationReport';

export type ReportJobItem = {
  id: string;
  jobCode?: string;
  title: string;
  match: number;
  icon: string;
  salary: string;
  skills: string[];
  gap: string[];
  isAnchor?: boolean;
};

export type ReportSemesterItem = {
  key: string;
  label: string;
  status: SemesterTiming;
  courses: string[];
  credits: number;
};

export type AnalysisReportModel = {
  subtitle: string;
  anchorJobLabel: string | null;
  anchorJobCode: string | null;
  showNextActionsTier: boolean;
  showContributionBadges: boolean;
  currentPercent: number;
  nextActionsPercent: number;
  /** @deprecated use expectedPercent — kept for FinalCoveragePlanSection */
  targetPercent: number;
  expectedPercent: number;
  remainingCount: number;
  completedCourseCount: number;
  earnedCredits: number;
  gapTokens: string[];
  skillRadar: SkillRadarPoint[];
  skillComparison: SkillComparison[];
  trackBars: TrackBarItem[];
  synergyTip: string;
  jobs: ReportJobItem[];
  semesters: ReportSemesterItem[];
  defaultExpandedSemesterIndex: number;
  remainingCoursePlan: RemainingCoursePlan[];
  prerequisiteWarning: string;
  aiActions: AIActionItem[];
};

function formatReportSubtitle(
  displayName: string,
  studentId: string | undefined,
  reportDate: Date,
): string {
  const yy = admissionYearFromStudentId(studentId);
  const badge = yy != null ? `${String(yy % 100).padStart(2, '0')}학번` : null;
  const name = displayName.trim() || '학생';
  const dateStr = `${reportDate.getFullYear()}.${String(reportDate.getMonth() + 1).padStart(2, '0')}.${String(reportDate.getDate()).padStart(2, '0')}`;
  const parts = [name, badge, `${dateStr} 기준`].filter(Boolean);
  return parts.join(' · ');
}

function buildTrackBars(trackRecommend: TrackRecommendPayload | null): TrackBarItem[] {
  if (!trackRecommend) return TRACK_BARS_FALLBACK;

  const colors = ['#14B8A6', '#0D9488', '#2DD4BF', '#5EEAD4'];
  const bars: TrackBarItem[] = [];

  for (const p of trackRecommend.primary) {
    if (p.score != null) {
      bars.push({
        name: p.title.replace(/\s*트랙$/, '트랙'),
        value: Math.min(100, Math.round(p.score * 0.75)),
        color: colors[bars.length % colors.length]!,
      });
    }
  }

  for (const s of trackRecommend.secondary.slice(0, 4 - bars.length)) {
    if (s.score != null) {
      bars.push({
        name: s.name.length > 12 ? s.name.slice(0, 12) + '…' : s.name,
        value: Math.min(100, Math.round(s.score * 0.75)),
        color: colors[bars.length % colors.length]!,
      });
    }
  }

  return bars.length > 0 ? bars.slice(0, 4) : TRACK_BARS_FALLBACK;
}

function buildSynergyTip(trackRecommend: TrackRecommendPayload | null): string {
  const score = trackRecommend?.combinationScore ?? 87;
  return `💡 빅데이터 + 컴퓨터공학 융합 시너지 스코어 ${score}점으로 상위 8% 수준`;
}

function enrichJob(job: JobRecommendation): ReportJobItem {
  const meta: JobReportEnrichment | undefined = JOB_REPORT_ENRICHMENT[job.title];
  const skills = job.coreSkills.length > 0 ? job.coreSkills.slice(0, 6) : job.techStack;
  const gap =
    meta?.gap ??
    job.advancedSkills.filter((s) => !skills.includes(s)).slice(0, 4);

  return {
    id: job.id,
    jobCode: job.code,
    title: job.title,
    match: job.matchScore,
    icon: meta?.icon ?? '💼',
    salary: meta?.salary ?? '연봉 정보 준비 중',
    skills,
    gap: gap.length > 0 ? gap : ['추가 역량 학습'],
  };
}

function semesterLabel(step: SemesterStep): string {
  const base = `${step.year}학년 ${step.semester}학기`;
  return step.timing === 'current' ? `${base} (현재)` : base;
}

function buildSemesters(
  roadmap: RoadmapPayload | null,
  studentYear: number,
): { semesters: ReportSemesterItem[]; defaultExpandedSemesterIndex: number } {
  if (!roadmap?.semesterSteps?.length) {
    return { semesters: [], defaultExpandedSemesterIndex: 0 };
  }

  const steps = applyStudentGradeToSemesterSteps(roadmap.semesterSteps, studentYear);
  const semesters: ReportSemesterItem[] = steps.map((step) => ({
    key: `${step.year}-${step.semester}`,
    label: semesterLabel(step),
    status: step.timing,
    courses: step.courses.map((c) => c.name),
    credits: step.totalCredits,
  }));

  const currentIdx = semesters.findIndex((s) => s.status === 'current');
  return {
    semesters,
    defaultExpandedSemesterIndex: currentIdx >= 0 ? currentIdx : 0,
  };
}

function mergeRemainingCoursePlanLocal(
  roadmapRemainingNames: string[],
): RemainingCoursePlan[] {
  const planByName = new Map(REMAINING_COURSE_PLAN.map((p) => [p.name, p]));

  const fromRoadmap = roadmapRemainingNames
    .map((name) => {
      const meta = planByName.get(name);
      if (meta) return meta;
      return {
        name,
        credits: 3,
        impact: '+7-8%',
        sem: '예정',
        area: '종합',
      } satisfies RemainingCoursePlan;
    })
    .slice(0, 6);

  if (fromRoadmap.length >= 6) return fromRoadmap;

  const used = new Set(fromRoadmap.map((c) => c.name));
  for (const p of REMAINING_COURSE_PLAN) {
    if (fromRoadmap.length >= 6) break;
    if (!used.has(p.name)) {
      fromRoadmap.push(p);
      used.add(p.name);
    }
  }

  return fromRoadmap.slice(0, 6);
}

function applyReportToModel(
  base: Omit<
    AnalysisReportModel,
    | 'anchorJobLabel'
    | 'anchorJobCode'
    | 'showNextActionsTier'
    | 'showContributionBadges'
    | 'currentPercent'
    | 'nextActionsPercent'
    | 'targetPercent'
    | 'expectedPercent'
    | 'remainingCount'
    | 'completedCourseCount'
    | 'earnedCredits'
    | 'gapTokens'
    | 'skillRadar'
    | 'skillComparison'
    | 'jobs'
    | 'remainingCoursePlan'
    | 'aiActions'
  >,
  report: RecommendationReportData,
  storeJobs: JobRecommendation[],
  anchorJobCode: string | undefined
): AnalysisReportModel {
  assertCoverageInvariant(report);

  const showNextActionsTier = isPrimaryAnchorReport(report);
  const showContribution = showNextActionsTier;
  const anchorCode = anchorJobCode ?? report.anchorJob?.code ?? null;

  return {
    ...base,
    anchorJobLabel: formatAnchorJobLabel(report.anchorJob),
    anchorJobCode: anchorCode,
    showNextActionsTier,
    showContributionBadges: showContribution,
    currentPercent: report.coverage.currentPercent,
    nextActionsPercent: report.coverage.nextActionsPercent,
    targetPercent: report.coverage.expectedPercent,
    expectedPercent: report.coverage.expectedPercent,
    remainingCount: report.remainingCourses.length,
    completedCourseCount: report.aggregate.completedCourseCount,
    earnedCredits: report.aggregate.earnedCredits,
    gapTokens: report.coverage.gapTokens,
    skillRadar: mapSkillRadarFromReport(report),
    skillComparison: mapSkillComparisonFromReport(report),
    jobs: mapReportJobs(report, storeJobs, anchorCode ?? undefined),
    remainingCoursePlan: mapRemainingCoursePlan(report, showContribution),
    aiActions:
      report.nextActions.length > 0 ? mapNextActions(report) : [],
  };
}

export function buildAnalysisReportModel(params: {
  report?: RecommendationReportData | null;
  anchorJobCode?: string;
  roadmap: RoadmapPayload | null;
  completedCourses: string[];
  jobs: JobRecommendation[];
  trackRecommend: TrackRecommendPayload | null;
  displayName: string;
  studentId?: string;
  studentYear: number;
  reportDate?: Date;
}): AnalysisReportModel {
  const {
    report,
    anchorJobCode,
    roadmap,
    completedCourses,
    jobs,
    trackRecommend,
    displayName,
    studentId,
    studentYear,
    reportDate = new Date(),
  } = params;

  const competency = computeCompetencyFromRoadmap(roadmap, completedCourses);
  const progress = computeRoadmapProgressStats(roadmap, completedCourses);
  const { semesters, defaultExpandedSemesterIndex } = buildSemesters(
    roadmap,
    studentYear,
  );

  const localBase: AnalysisReportModel = {
    subtitle: formatReportSubtitle(displayName, studentId, reportDate),
    anchorJobLabel: null,
    anchorJobCode: null,
    showNextActionsTier: true,
    showContributionBadges: true,
    currentPercent: competency.currentPercent,
    nextActionsPercent: competency.targetPercent,
    targetPercent: competency.targetPercent,
    expectedPercent: competency.targetPercent,
    remainingCount: competency.remainingCount,
    completedCourseCount: progress.completedCourseCount,
    earnedCredits: progress.earnedCredits,
    gapTokens: [],
    skillRadar: SKILL_RADAR,
    skillComparison: SKILL_COMPARISON,
    trackBars: buildTrackBars(trackRecommend),
    synergyTip: buildSynergyTip(trackRecommend),
    jobs: jobs.slice(0, 3).map(enrichJob),
    semesters,
    defaultExpandedSemesterIndex,
    remainingCoursePlan: mergeRemainingCoursePlanLocal(
      progress.remainingAll.map((c) => c.name),
    ),
    prerequisiteWarning:
      trackRecommend?.prerequisiteNote?.trim() || PREREQUISITE_WARNING_FALLBACK,
    aiActions: AI_ACTIONS,
  };

  if (!report) {
    return localBase;
  }

  return applyReportToModel(localBase, report, jobs, anchorJobCode);
}
