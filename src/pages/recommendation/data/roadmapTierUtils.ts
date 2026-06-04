import { hansungCourseData, type HansungCourse } from '../../../data/hansungCourseData';
import type { RoadmapPayload, SemesterCourse, SemesterTiming } from '../../../data/mockRoadmapData';
import {
  isUserCompletedCourse,
  toCompletedCourseSet,
} from '../utils/courseCompletion';

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

export interface RoadmapSemesterBlock {
  semester: 1 | 2;
  label: string;
  courses: string[];
  timing: SemesterTiming;
  doneCount: number;
  totalCount: number;
}

export interface RoadmapTierDefinition {
  tier: TierNumber;
  label: string;
  courses: string[];
  semesters: RoadmapSemesterBlock[];
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

const MAX_CATALOG_PER_TIER = 4;

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

function isCourseDone(course: SemesterCourse, completedSet: Set<string>): boolean {
  return isUserCompletedCourse(course.name, completedSet);
}

/** 마이페이지·프로필 이수 과목명 목록 (API completed 플래그는 반영하지 않음) */
export function buildEffectiveCompletedCourses(
  _roadmap: RoadmapPayload | null,
  completedCourseNames: string[],
): string[] {
  return [...toCompletedCourseSet(completedCourseNames)];
}

/** 추천 API semesterSteps → stageNumber(기초/핵심/응용/산학)별 과목 */
function coursesFromSemesterStepsByStage(
  roadmap: RoadmapPayload,
): Map<TierNumber, string[]> {
  const map = new Map<TierNumber, string[]>();

  for (const step of roadmap.semesterSteps) {
    const tier = step.stageNumber as TierNumber;
    if (tier < 1 || tier > 4) continue;
    const list = map.get(tier) ?? [];
    for (const c of step.courses) {
      if (!list.includes(c.name)) list.push(c.name);
    }
    map.set(tier, list);
  }
  return map;
}

function tierLabelFromRoadmap(roadmap: RoadmapPayload, tier: TierNumber): string {
  const step = roadmap.semesterSteps.find((s) => s.stageNumber === tier);
  if (step?.stageLabel) {
    const yearHint = YEAR_LABELS[tier].split('·')[0]?.trim() ?? '';
    return `${yearHint} · ${step.stageLabel}`;
  }
  return YEAR_LABELS[tier];
}

function computeTierStatusFromRoadmap(
  roadmap: RoadmapPayload,
  tier: TierNumber,
  studentYear: number,
  completedSet: Set<string>,
): TierStatus {
  const steps = roadmap.semesterSteps.filter((s) => s.stageNumber === tier);
  if (steps.length === 0) {
    return computeYearCardStatus(tier, studentYear);
  }

  const { doneCount, totalCount } = computeTierProgressFromRoadmap(
    roadmap,
    tier,
    completedSet,
  );
  if (totalCount > 0 && doneCount >= totalCount) return 'done';
  if (steps.some((s) => s.timing === 'current')) return 'current';
  if (steps.some((s) => s.timing === 'past')) return 'current';
  if (steps.every((s) => s.timing === 'future')) return 'future';
  return computeYearCardStatus(tier, studentYear);
}

function buildSemesterBlocksFromRoadmap(
  roadmap: RoadmapPayload,
  tier: TierNumber,
  completedSet: Set<string>,
): RoadmapSemesterBlock[] {
  const steps = roadmap.semesterSteps
    .filter((s) => s.stageNumber === tier)
    .sort((a, b) => a.year - b.year || a.semester - b.semester);

  const blocks: RoadmapSemesterBlock[] = [];

  for (const semester of [1, 2] as const) {
    const semesterSteps = steps.filter((s) => s.semester === semester);
    if (semesterSteps.length === 0) continue;

    const courses: string[] = [];
    let doneCount = 0;
    let totalCount = 0;
    let timing: SemesterTiming = 'future';

    for (const step of semesterSteps) {
      if (step.timing === 'current') timing = 'current';
      else if (step.timing === 'past' && timing !== 'current') timing = 'past';

      for (const course of step.courses) {
        totalCount += 1;
        if (!courses.includes(course.name)) courses.push(course.name);
        if (isCourseDone(course, completedSet)) {
          doneCount += 1;
        }
      }
    }

    blocks.push({
      semester,
      label: `${semester}학기`,
      courses,
      timing,
      doneCount,
      totalCount,
    });
  }

  return blocks;
}

function buildSemesterBlocksFromCatalog(courses: string[]): RoadmapSemesterBlock[] {
  if (courses.length === 0) return [];

  const mid = Math.ceil(courses.length / 2);
  const first = courses.slice(0, mid);
  const second = courses.slice(mid);

  const blocks: RoadmapSemesterBlock[] = [];
  if (first.length > 0) {
    blocks.push({
      semester: 1,
      label: '1학기',
      courses: first,
      timing: 'future',
      doneCount: 0,
      totalCount: first.length,
    });
  }
  if (second.length > 0) {
    blocks.push({
      semester: 2,
      label: '2학기',
      courses: second,
      timing: 'future',
      doneCount: 0,
      totalCount: second.length,
    });
  }
  return blocks;
}

function computeTierProgressFromRoadmap(
  roadmap: RoadmapPayload,
  tier: TierNumber,
  completedSet: Set<string>,
): { doneCount: number; totalCount: number } {
  let doneCount = 0;
  let totalCount = 0;

  for (const step of roadmap.semesterSteps) {
    if (step.stageNumber !== tier) continue;
    for (const course of step.courses) {
      totalCount += 1;
      if (isCourseDone(course, completedSet)) {
        doneCount += 1;
      }
    }
  }

  return { doneCount, totalCount };
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

function definitionsFromApiRoadmap(roadmap: RoadmapPayload): RoadmapTierDefinition[] {
  const apiMap = coursesFromSemesterStepsByStage(roadmap);
  const tiers: TierNumber[] = [1, 2, 3, 4];

  return tiers.map((tier) => {
    const courses = apiMap.get(tier) ?? [];
    const def: RoadmapTierDefinition = {
      tier,
      label: tierLabelFromRoadmap(roadmap, tier),
      courses,
      semesters: [],
    };

    if (tier === 2 && courses.some((c) => c.includes('자료구조'))) {
      def.warning = '알고리즘 수강 전 자료구조 이수 필요';
    }

    return def;
  });
}

function definitionsFromCatalog(
  catalogMap: Map<TierNumber, string[]>,
): RoadmapTierDefinition[] {
  const tiers: TierNumber[] = [1, 2, 3, 4];

  return tiers.map((tier) => {
    const courses = (catalogMap.get(tier) ?? []).slice(0, MAX_CATALOG_PER_TIER);
    const def: RoadmapTierDefinition = {
      tier,
      label: YEAR_LABELS[tier],
      courses,
      semesters: buildSemesterBlocksFromCatalog(courses),
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
  const effectiveCompleted = buildEffectiveCompletedCourses(
    params.roadmap,
    params.completedCourses,
  );
  const completedSet = toCompletedCourseSet(effectiveCompleted);

  const hasApiRoadmap = (params.roadmap?.semesterSteps?.length ?? 0) > 0;
  const definitions = hasApiRoadmap
    ? definitionsFromApiRoadmap(params.roadmap!)
    : definitionsFromCatalog(coursesFromCatalog(params.track1, params.track2));

  return definitions.map((def) => {
    const semesters =
      hasApiRoadmap && params.roadmap
        ? buildSemesterBlocksFromRoadmap(params.roadmap, def.tier, completedSet)
        : def.semesters.map((block) => ({
            ...block,
            doneCount: block.courses.filter((c) => effectiveCompleted.includes(c)).length,
          }));

    const progress =
      hasApiRoadmap && params.roadmap
        ? computeTierProgressFromRoadmap(params.roadmap, def.tier, completedSet)
        : computeCourseProgress(def.courses, effectiveCompleted);

    const status =
      hasApiRoadmap && params.roadmap
        ? computeTierStatusFromRoadmap(
            params.roadmap,
            def.tier,
            params.studentYear,
            completedSet,
          )
        : computeYearCardStatus(def.tier, params.studentYear);

    return {
      ...def,
      semesters,
      status,
      doneCount: progress.doneCount,
      totalCount: progress.totalCount,
    };
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
