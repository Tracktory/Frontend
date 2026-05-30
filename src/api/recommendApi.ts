import { AuthApiError } from './authApi';
import type { JobRecommendation } from '../data/mockRecommendData';
import type { TrackRecommendPayload } from '../data/mockTrackRecommendData';
import type { RoadmapPayload, SemesterStep, SemesterCourse } from '../data/mockRoadmapData';

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

interface ApiJobItem {
  jobId: number;
  name: string;
  score: number;
  reasoning: string;
  techStacks: string[];
}

interface ApiPrimaryTrack {
  trackId: number;
  name: string;
  trackOrder: 1 | 2;
  score: number;
  coreSubjects: string[];
  relatedJobs: string[];
}

interface ApiSupportingTrack {
  trackId: number;
  name: string;
}

interface ApiTracksPayload {
  combination: {
    score: number;
    summary: string;
    reasoning: string;
  };
  trackDescription: string;
  primary: ApiPrimaryTrack[];
  supporting: ApiSupportingTrack[];
}

interface ApiCourseItem {
  subjectId: number;
  name: string;
  credit: number;
  score: number;
  completed: boolean;
  stageLabel: string;
  description: string;
  prerequisites: { subjectId: number; name: string; completed: boolean; strength: string }[];
}

interface ApiSemesterGroup {
  year: number;
  semester: number;
  timing: 'past' | 'current' | 'future';
  stage: string;
  stageLabel: string;
  totalCredits: number;
  requiredCredits: number;
  summary: string;
  items: ApiCourseItem[];
}

interface ApiRoadmapPayload {
  totalSemestersRemaining: number;
  semesterRange: string;
  semesterGroups: ApiSemesterGroup[];
}

interface ApiFlow {
  interestSummary: string;
  jobName: string;
  tracksSummary: string;
}

interface ApiRecommendData {
  recommendationId: number;
  status: string;
  triggerSource: string;
  createdAt: string;
  flow: ApiFlow;
  jobs: { items: ApiJobItem[] };
  tracks: ApiTracksPayload;
  roadmap: ApiRoadmapPayload;
}

// ---------- Mapper functions ----------

function mapJobs(items: ApiJobItem[]): JobRecommendation[] {
  return items.map((item) => ({
    id: String(item.jobId),
    title: item.name,
    description: item.reasoning,
    matchScore: item.score,
    techStack: item.techStacks,
    techStackReady: item.techStacks.length > 0,
  }));
}

function mapTracks(tracks: ApiTracksPayload): TrackRecommendPayload {
  const primary = tracks.primary.map((t) => ({
    rank: t.trackOrder,
    title: t.name,
    coreSubjects: `핵심과목 : ${t.coreSubjects.join(', ')}`,
    relatedJobs: t.relatedJobs,
    emphasized: t.trackOrder === 1,
  })) as TrackRecommendPayload['primary'];

  const secondary = tracks.supporting.map((t, i) => ({
    id: `s${i + 1}`,
    name: t.name,
    emphasized: false,
  }));

  return {
    primary,
    secondary,
    llmSynergy: tracks.combination.reasoning,
    trackDescription: tracks.trackDescription,
    requiredCourses: tracks.primary[0]?.coreSubjects ?? [],
    prerequisiteNote: '',
  };
}

const STAGE_NUMBER_MAP: Record<string, 1 | 2 | 3 | 4> = {
  foundation: 1,
  core: 2,
  advanced: 3,
  capstone: 4,
};

function mapRoadmap(roadmap: ApiRoadmapPayload, flow: ApiFlow): RoadmapPayload {
  const semesterSteps: SemesterStep[] = roadmap.semesterGroups.map((g) => {
    const courses: SemesterCourse[] = g.items.map((item) => ({
      id: String(item.subjectId),
      name: item.name,
      description: item.description,
      credits: item.credit,
    }));

    return {
      year: g.year as 1 | 2 | 3 | 4,
      semester: g.semester as 1 | 2,
      stageLabel: g.stageLabel,
      stageNumber: STAGE_NUMBER_MAP[g.stage] ?? 1,
      totalCredits: g.totalCredits,
      courses,
    };
  });

  const currentGroup = roadmap.semesterGroups.find((g) => g.timing === 'current');
  const futureGroup = roadmap.semesterGroups.find((g) => g.timing === 'future');

  const semesterGuide = {
    nextSemester: currentGroup?.items.map((i) => i.name) ?? [],
    afterNextSemester: futureGroup?.items.map((i) => i.name) ?? [],
  };

  const connectionMessage = flow.jobName && flow.tracksSummary
    ? `${flow.jobName} → ${flow.tracksSummary}`
    : flow.interestSummary;

  return {
    steps: [],
    semesterSteps,
    semesterGuide,
    connectionMessage,
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
    jobs: mapJobs(data.jobs.items),
    trackRecommend: mapTracks(data.tracks),
    roadmap: mapRoadmap(data.roadmap, data.flow),
  };
}
