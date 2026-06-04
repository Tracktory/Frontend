import { AuthApiError } from './authApi';
import type { JobRecommendation } from '../data/mockRecommendData';
import type { TrackRecommendPayload } from '../data/mockTrackRecommendData';
import type { RoadmapPayload, SemesterStep, SemesterCourse, SemesterTiming } from '../data/mockRoadmapData';

export type RecommendResult = {
  jobs: JobRecommendation[];
  trackRecommend: TrackRecommendPayload;
  roadmap: RoadmapPayload;
};

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

// ---------- Internal API response types ----------

interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string; details: unknown } | null;
}

interface ApiRelatedTrack {
  name: string;
  description: string;
}

interface ApiSubjectRef {
  code?: string;
  name: string;
}

interface ApiJobItem {
  jobId?: number;
  id?: number;
  code?: string;
  name: string;
  score: number;
  description?: string;
  reasoning?: string | null;
  techStacks?: string[];
  techStackReady?: boolean;
  detailedDescription?: string;
  coreSkills?: string[];
  advancedSkills?: string[];
  relatedTracks?: ApiRelatedTrack[];
}

interface ApiPrimaryTrack {
  trackId?: number;
  code?: string;
  name: string;
  trackOrder?: 1 | 2;
  score?: number;
  reasoning?: string | null;
  primary?: boolean;
  mainSubjects?: ApiSubjectRef[];
  coreSubjects?: string[];
  relatedJobs?: string[];
}

interface ApiSupportingTrack {
  trackId?: number;
  code?: string;
  name: string;
  score?: number | null;
  reasoning?: string | null;
  primary?: boolean;
  isCrossCombination?: boolean;
  mainSubjects?: ApiSubjectRef[];
  coreSubjects?: string[];
}

interface ApiTracksPayload {
  combination?: { score: number; summary: string; reasoning: string };
  combinationScore?: number;
  combinationSummary?: string;
  combinationReasoning?: string;
  trackDescription?: string;
  requiredCourses?: string[];
  prerequisiteNote?: string;
  primary: ApiPrimaryTrack[];
  supporting?: ApiSupportingTrack[];
  secondary?: ApiSupportingTrack[];
}

interface ApiCoursePrerequisite {
  subjectId?: number;
  code?: string;
  name: string;
  completed?: boolean;
  strength?: string;
}

interface ApiCourseItem {
  subjectId?: number;
  code?: string;
  name: string;
  timing?: string;
  completed?: boolean;
  score?: number | null;
  credit?: number;
  description?: string;
  stageLabel?: string;
  prerequisites?: ApiCoursePrerequisite[];
}

interface ApiSemesterGroup {
  year: number;
  semester: number;
  stage: string;
  stageLabel?: string;
  timing: string;
  totalCredits?: number;
  requiredCredits?: number;
  summary?: string;
  items?: ApiCourseItem[];
  courses?: ApiCourseItem[];
}

interface ApiRoadmapPayload {
  reasoning?: string;
  totalSemestersRemaining?: number;
  semesterRange?: string;
  semesterGroups?: ApiSemesterGroup[];
  semesters?: ApiSemesterGroup[];
}

interface ApiFlow {
  interestSummary?: string;
  jobName?: string;
  tracksSummary?: string;
}

interface ApiRecommendData {
  recommendationId: number;
  status?: string;
  triggerSource?: string;
  createdAt?: string;
  flow?: ApiFlow;
  jobs: ApiJobItem[] | { items: ApiJobItem[] };
  tracks: ApiTracksPayload;
  roadmap: ApiRoadmapPayload;
}

// ---------- Mapper helpers ----------

function extractJobItems(jobs: ApiRecommendData['jobs']): ApiJobItem[] {
  if (Array.isArray(jobs)) return jobs;
  return jobs?.items ?? [];
}

function extractSemesterGroups(roadmap: ApiRoadmapPayload): ApiSemesterGroup[] {
  return roadmap.semesterGroups ?? roadmap.semesters ?? [];
}

function extractCourses(group: ApiSemesterGroup): ApiCourseItem[] {
  return group.items ?? group.courses ?? [];
}

function normalizeTiming(timing: string): SemesterTiming {
  const lower = timing.toLowerCase();
  if (lower === 'past') return 'past';
  if (lower === 'current') return 'current';
  return 'future';
}

const STAGE_NUMBER_MAP: Record<string, 1 | 2 | 3 | 4> = {
  foundation: 1,
  core: 2,
  applied: 3,
  industry: 4,
};

const STAGE_LABEL_MAP: Record<string, string> = {
  foundation: '기초',
  core: '핵심',
  applied: '응용',
  industry: '산학',
};

// ---------- Mapper functions ----------

function mapMainSubjects(
  mainSubjects?: ApiSubjectRef[],
  coreSubjects?: string[]
): { code?: string; name: string }[] {
  if (mainSubjects?.length) {
    return mainSubjects
      .filter((s) => Boolean(s.name))
      .map((s) => ({ code: s.code, name: s.name }));
  }
  return (coreSubjects ?? []).map((name) => ({ name }));
}

function mapSubjectNames(
  mainSubjects?: ApiSubjectRef[],
  coreSubjects?: string[]
): string[] {
  return mapMainSubjects(mainSubjects, coreSubjects).map((s) => s.name);
}

function mapJobs(items: ApiJobItem[]): JobRecommendation[] {
  return items.map((item, index) => ({
    id: String(item.jobId ?? item.id ?? index + 1),
    code: item.code,
    title: item.name,
    description: item.description ?? '',
    reasoning: item.reasoning ?? '',
    matchScore: item.score ?? 0,
    techStack: (item.techStacks ?? []).slice(0, 4),
    techStackReady: item.techStackReady ?? (item.techStacks?.length ?? 0) > 0,
    detailedDescription: item.detailedDescription ?? item.description ?? '',
    coreSkills: item.coreSkills ?? [],
    advancedSkills: item.advancedSkills ?? [],
    relatedTracks: item.relatedTracks ?? [],
  }));
}

function mapTracks(tracks: ApiTracksPayload): TrackRecommendPayload {
  const combinationScore =
    tracks.combination?.score ?? tracks.combinationScore;

  const primary = tracks.primary.map((t, index) => {
    const rank = (t.trackOrder ?? (index === 0 ? 1 : 2)) as 1 | 2;
    const rankLabel = rank === 1 ? '1트랙·주전공' : '2트랙';

    return {
      rank,
      title: t.name,
      rankLabel,
      score: t.score ?? combinationScore ?? null,
      reasoning: t.reasoning?.trim() || null,
      mainSubjects: mapMainSubjects(t.mainSubjects, t.coreSubjects),
      coreSubjects: mapSubjectNames(t.mainSubjects, t.coreSubjects),
      relatedJobs: t.relatedJobs ?? [],
    };
  });

  const supportingList = tracks.supporting ?? tracks.secondary ?? [];
  const secondary = supportingList.map((t, i) => ({
    id: String(t.trackId ?? t.code ?? `s${i + 1}`),
    name: t.name,
    score: t.score ?? null,
    reasoning: t.reasoning?.trim() || null,
    isCrossCombination: t.isCrossCombination ?? false,
    mainSubjects: mapMainSubjects(t.mainSubjects, t.coreSubjects),
  }));

  const combinationSummary =
    tracks.combination?.summary ??
    tracks.combinationSummary ??
    '';
  const combinationReasoning =
    tracks.combination?.reasoning ??
    tracks.combinationReasoning ??
    combinationSummary;

  return {
    combinationScore,
    combinationReasoning,
    primary,
    secondary,
    llmSynergy: combinationReasoning || combinationSummary,
    trackDescription: tracks.trackDescription ?? combinationSummary,
    requiredCourses:
      tracks.requiredCourses ??
      mapSubjectNames(tracks.primary[0]?.mainSubjects, tracks.primary[0]?.coreSubjects),
    prerequisiteNote: tracks.prerequisiteNote ?? '',
  };
}

function buildConnectionMessage(
  flow: ApiFlow | undefined,
  tracks: ApiTracksPayload,
  roadmap: ApiRoadmapPayload
): string {
  if (flow?.jobName && flow?.tracksSummary) {
    return `${flow.jobName} → ${flow.tracksSummary}`;
  }
  if (flow?.interestSummary) return flow.interestSummary;

  const summary =
    tracks.combination?.summary ??
    tracks.combinationSummary ??
    '';
  if (summary) return summary;

  return roadmap.reasoning ?? tracks.combinationReasoning ?? tracks.combination?.reasoning ?? '';
}

function mapRoadmap(
  roadmap: ApiRoadmapPayload,
  tracks: ApiTracksPayload,
  flow?: ApiFlow
): RoadmapPayload {
  const groups = extractSemesterGroups(roadmap);

  const semesterSteps: SemesterStep[] = groups.map((g) => {
    const timing = normalizeTiming(g.timing);
    const courses: SemesterCourse[] = extractCourses(g).map((item) => ({
      id: String(item.subjectId ?? item.code ?? item.name),
      name: item.name,
      description: item.description ?? '',
      credits: item.credit ?? 3,
      score: item.score ?? undefined,
      completed: item.completed ?? false,
      timing: item.timing ? normalizeTiming(item.timing) : timing,
      prerequisites: (item.prerequisites ?? []).map((p) => ({
        name: p.name,
        completed: p.completed ?? false,
        strength: p.strength ?? '',
      })),
    }));

    const stageKey = g.stage.toLowerCase();

    return {
      year: g.year as 1 | 2 | 3 | 4,
      semester: g.semester as 1 | 2,
      timing,
      stageLabel: g.stageLabel ?? STAGE_LABEL_MAP[stageKey] ?? g.stage,
      stageNumber: STAGE_NUMBER_MAP[stageKey] ?? 1,
      totalCredits: g.totalCredits ?? courses.reduce((sum, c) => sum + c.credits, 0),
      courses,
    };
  });

  const currentGroup = groups.find((g) => normalizeTiming(g.timing) === 'current');
  const futureGroups = groups.filter((g) => normalizeTiming(g.timing) === 'future');

  const semesterGuide = {
    nextSemester: currentGroup ? extractCourses(currentGroup).map((c) => c.name) : [],
    afterNextSemester: futureGroups[0] ? extractCourses(futureGroups[0]).map((c) => c.name) : [],
  };

  return {
    steps: [],
    semesterSteps,
    semesterGuide,
    connectionMessage: buildConnectionMessage(flow, tracks, roadmap),
  };
}

// ---------- Public API ----------

export async function fetchRecommendResult(
  accessToken: string,
  forceRefresh = false
): Promise<RecommendResult> {
  const res = await fetch(`${BASE_URL}/api/v1/recommendations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ forceRefresh }),
  });

  const envelope: ApiEnvelope<ApiRecommendData> = await res.json();

  if (!envelope.success) {
    const code = envelope.error?.code ?? 'UNKNOWN';
    const message = envelope.error?.message ?? '알 수 없는 오류가 발생했습니다.';
    throw new AuthApiError(code, message);
  }

  if (!envelope.data) {
    throw new Error('응답 데이터가 없습니다.');
  }

  const data = envelope.data;
  return {
    jobs: mapJobs(extractJobItems(data.jobs)),
    trackRecommend: mapTracks(data.tracks),
    roadmap: mapRoadmap(data.roadmap, data.tracks, data.flow),
  };
}
