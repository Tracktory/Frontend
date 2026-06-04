import { hansungCourseData, type HansungCourse } from '../../../data/hansungCourseData';
import type { RoadmapPayload } from '../../../data/mockRoadmapData';

const IT_TRACK_KEYWORDS = [
  '빅데이터',
  '컴퓨터',
  'AI',
  '웹',
  '소프트웨어',
  'IT',
  '정보',
  '디지털',
  '모바일',
  '시스템',
  '전자',
  '반도체',
  '산업',
  '융합',
];

export type TierNumber = 1 | 2 | 3 | 4;
export type TierStatus = 'done' | 'current' | 'future';

export interface RoadmapTierDefinition {
  tier: TierNumber;
  label: string;
  courses: string[];
  warning?: string;
}

export interface RoadmapTierViewModel extends RoadmapTierDefinition {
  status: TierStatus;
  doneCount: number;
  totalCount: number;
}

const YEAR_LABELS: Record<TierNumber, string> = {
  1: '1학년 · 기초',
  2: '2학년 · 핵심',
  3: '3학년 · 응용',
  4: '4학년 · 캡스톤',
};

const TIER_1_KEYWORDS = ['기초', '개론', '입문', '프로그래밍 기초', 'Foundation'];
const TIER_3_KEYWORDS = [
  '머신러닝',
  '마이닝',
  '서버',
  '딥러닝',
  '클라우드',
  '인공지능',
  'AI ',
  '웹프로그래밍',
  '모바일',
  '보안',
];
const TIER_2_KEYWORDS = [
  '알고리즘',
  '데이터베이스',
  '객체지향',
  '운영체제',
  '빅데이터',
  '자료구조',
  '네트워크',
  '컴파일',
  '소프트웨어',
];

const MAX_DISPLAY_PER_TIER = 4;

function normalizeTrackName(name: string): string {
  return name.replace(/·/g, 'ㆍ').trim();
}

function matchesUserTracks(course: HansungCourse, track1: string, track2: string): boolean {
  const ct = normalizeTrackName(course.track);
  const t1 = track1 ? normalizeTrackName(track1) : '';
  const t2 = track2 ? normalizeTrackName(track2) : '';
  if (t1 && (ct.includes(t1) || t1.includes(ct))) return true;
  if (t2 && (ct.includes(t2) || t2.includes(ct))) return true;
  return IT_TRACK_KEYWORDS.some((kw) => course.track.includes(kw));
}

function classifyCourseTier(subject: string): TierNumber {
  const s = subject.toLowerCase();
  if (subject.includes('캡스톤') || s.includes('capstone')) return 4;
  if (TIER_1_KEYWORDS.some((kw) => subject.includes(kw))) return 1;
  if (TIER_3_KEYWORDS.some((kw) => subject.includes(kw))) return 3;
  if (TIER_2_KEYWORDS.some((kw) => subject.includes(kw))) return 2;
  return 2;
}

function uniqueSubjects(names: string[]): string[] {
  return [...new Set(names.map((n) => n.trim()).filter(Boolean))];
}

function coursesFromSemesterSteps(roadmap: RoadmapPayload | null): Map<TierNumber, string[]> {
  const map = new Map<TierNumber, string[]>();
  if (!roadmap?.semesterSteps?.length) return map;

  for (const step of roadmap.semesterSteps) {
    const year = step.year as TierNumber;
    const list = map.get(year) ?? [];
    for (const c of step.courses) {
      if (!list.includes(c.name)) list.push(c.name);
    }
    map.set(year, list);
  }
  return map;
}

function coursesFromCatalog(track1: string, track2: string): Map<TierNumber, string[]> {
  const map = new Map<TierNumber, string[]>();

  for (const course of hansungCourseData) {
    if (!matchesUserTracks(course, track1, track2)) continue;

    const tier = classifyCourseTier(course.subject);
    const list = map.get(tier) ?? [];
    if (!list.includes(course.subject)) list.push(course.subject);
    map.set(tier, list);
  }
  return map;
}

function mergeTierCourses(
  apiMap: Map<TierNumber, string[]>,
  catalogMap: Map<TierNumber, string[]>,
  maxPerTier: number
): RoadmapTierDefinition[] {
  const tiers: TierNumber[] = [1, 2, 3, 4];

  return tiers.map((tier) => {
    const fromApi = apiMap.get(tier) ?? [];
    const fromCatalog = catalogMap.get(tier) ?? [];
    const merged = uniqueSubjects([...fromApi, ...fromCatalog]).slice(0, maxPerTier);

    const def: RoadmapTierDefinition = {
      tier,
      label: YEAR_LABELS[tier],
      courses: merged,
    };

    if (tier === 2) {
      def.warning = '알고리즘 수강 전 자료구조 이수 필요';
    }

    return def;
  });
}

export function computeYearCardStatus(tier: TierNumber, studentYear: number): TierStatus {
  if (tier < studentYear) return 'done';
  if (tier === studentYear) return 'current';
  return 'future';
}

export function computeCourseProgress(
  courses: string[],
  completedCourses: string[]
): { doneCount: number; totalCount: number } {
  const totalCount = courses.length;
  const doneCount = courses.filter((c) => completedCourses.includes(c)).length;
  return { doneCount, totalCount };
}

export function getRoadmapDisplayTiers(params: {
  track1: string;
  track2: string;
  studentYear: number;
  completedCourses: string[];
  roadmap: RoadmapPayload | null;
}): RoadmapTierViewModel[] {
  const apiMap = coursesFromSemesterSteps(params.roadmap);
  const catalogMap = coursesFromCatalog(params.track1, params.track2);
  const definitions = mergeTierCourses(apiMap, catalogMap, MAX_DISPLAY_PER_TIER);

  return definitions.map((def) => {
    const { doneCount, totalCount } = computeCourseProgress(
      def.courses,
      params.completedCourses
    );
    const status = computeYearCardStatus(def.tier, params.studentYear);
    return { ...def, status, doneCount, totalCount };
  });
}

export function shouldShowTierWarning(
  tier: RoadmapTierDefinition,
  status: TierStatus,
  completedCourses: string[]
): boolean {
  if (tier.tier !== 2 || !tier.warning || status === 'done') return false;

  const hasAlgorithm = tier.courses.some(
    (c) => c.includes('알고리즘') && !completedCourses.includes(c)
  );
  const hasDataStructure = completedCourses.some((c) => c.includes('자료구조'));
  const needsDataStructure = tier.courses.some((c) => c.includes('자료구조'));

  return hasAlgorithm && needsDataStructure && !hasDataStructure;
}
