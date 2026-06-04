import type { JobRecommendation } from '../../../data/mockRecommendData';
import type {
  RoadmapPayload,
  SemesterStep,
  SemesterTiming,
} from '../../../data/mockRoadmapData';
import type { TrackRecommendPayload } from '../../../data/mockTrackRecommendData';
import { admissionYearFromStudentId } from '../../../utils/mapProfileToOnboarding';
import { applyStudentGradeToSemesterSteps } from '../../../utils/roadmapTiming';
import {
  PREREQUISITE_WARNING_FALLBACK,
  TRACK_BARS_FALLBACK,
  type RemainingCoursePlan,
  type TrackBarItem,
} from '../data/analysisReportStaticMock';
import {
  computeCompetencyFromRoadmap,
  computeRoadmapProgressStats,
} from './journeyCompetency';

export type ReportJobItem = {
  id: string;
  jobCode?: string;
  title: string;
  description: string;
  reasoning: string;
  match: number;
  techStack: string[];
  coreSkills: string[];
  advancedSkills: string[];
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
  currentPercent: number;
  targetPercent: number;
  expectedPercent: number;
  remainingCount: number;
  completedCourseCount: number;
  earnedCredits: number;
  trackBars: TrackBarItem[];
  synergyTip: string;
  jobs: ReportJobItem[];
  semesters: ReportSemesterItem[];
  defaultExpandedSemesterIndex: number;
  remainingCoursePlan: RemainingCoursePlan[];
  showContributionBadges: boolean;
  prerequisiteWarning: string;
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
        name: p.title,
        value: Math.min(100, Math.round(p.score)),
        color: colors[bars.length % colors.length]!,
      });
    }
  }

  for (const s of trackRecommend.secondary.slice(0, 4 - bars.length)) {
    if (s.score != null) {
      bars.push({
        name: s.name,
        value: Math.min(100, Math.round(s.score)),
        color: colors[bars.length % colors.length]!,
      });
    }
  }

  return bars.length > 0 ? bars.slice(0, 4) : TRACK_BARS_FALLBACK;
}

function buildSynergyTip(trackRecommend: TrackRecommendPayload | null): string {
  const reasoning =
    trackRecommend?.combinationReasoning?.trim() ||
    trackRecommend?.llmSynergy?.trim() ||
    trackRecommend?.trackDescription?.trim();
  if (reasoning) {
    return reasoning.startsWith('💡') ? reasoning : `💡 ${reasoning}`;
  }
  const score = trackRecommend?.combinationScore;
  if (score != null) {
    return `💡 트랙 조합 시너지 스코어 ${score}점`;
  }
  return '💡 추천 트랙 조합을 이수하면 역량 시너지가 커집니다.';
}

function mapJob(job: JobRecommendation): ReportJobItem {
  return {
    id: job.id,
    jobCode: job.code,
    title: job.title,
    description: job.description,
    reasoning: job.reasoning,
    match: job.matchScore,
    techStack: job.techStackReady ? job.techStack : [],
    coreSkills: job.coreSkills,
    advancedSkills: job.advancedSkills,
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

function findCourseInRoadmap(
  roadmap: RoadmapPayload | null,
  name: string,
): { credits: number; sem: string; area: string } | null {
  if (!roadmap?.semesterSteps?.length) return null;

  for (const step of roadmap.semesterSteps) {
    const course = step.courses.find((c) => c.name === name);
    if (course) {
      return {
        credits: course.credits ?? 3,
        sem: `${step.year}학년 ${step.semester}학기`,
        area: step.stageLabel,
      };
    }
  }
  return null;
}

function buildRemainingCoursePlanFromRoadmap(
  roadmap: RoadmapPayload | null,
  remaining: { name: string; gainLabel: string }[],
): RemainingCoursePlan[] {
  return remaining.map(({ name, gainLabel }) => {
    const meta = findCourseInRoadmap(roadmap, name);
    return {
      name,
      credits: meta?.credits ?? 3,
      impact: gainLabel,
      sem: meta?.sem ?? '예정',
      area: meta?.area ?? '종합',
    };
  });
}

export function buildAnalysisReportModel(params: {
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
  const remainingCoursePlan = buildRemainingCoursePlanFromRoadmap(
    roadmap,
    progress.remainingAll,
  );

  return {
    subtitle: formatReportSubtitle(displayName, studentId, reportDate),
    currentPercent: competency.currentPercent,
    targetPercent: competency.targetPercent,
    expectedPercent: competency.targetPercent,
    remainingCount: competency.remainingCount,
    completedCourseCount: progress.completedCourseCount,
    earnedCredits: progress.earnedCredits,
    trackBars: buildTrackBars(trackRecommend),
    synergyTip: buildSynergyTip(trackRecommend),
    jobs: jobs.slice(0, 3).map(mapJob),
    semesters,
    defaultExpandedSemesterIndex,
    remainingCoursePlan,
    showContributionBadges: remainingCoursePlan.some((c) => c.impact !== '—'),
    prerequisiteWarning:
      trackRecommend?.prerequisiteNote?.trim() || PREREQUISITE_WARNING_FALLBACK,
  };
}
