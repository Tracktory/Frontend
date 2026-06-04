import type { RoadmapPayload, SemesterCourse } from '../../../data/mockRoadmapData';
import { isUserCompletedCourse, toCompletedCourseSet } from './courseCompletion';

const MAX_COMPETENCY_PERCENT = 95;

export type CompetencyStats = {
  currentPercent: number;
  targetPercent: number;
  remainingCourses: { name: string; gainLabel: string }[];
  remainingCount: number;
};

export type RoadmapProgressStats = {
  totalCourses: number;
  completedCourseCount: number;
  earnedCredits: number;
  totalWeight: number;
  earnedWeight: number;
  remainingAll: { name: string; gainLabel: string }[];
};

function getCourseWeight(course: Pick<SemesterCourse, 'score'>): number {
  if (course.score != null && course.score > 0) return course.score;
  return 1;
}

function toWeightedPercent(earnedWeight: number, totalWeight: number): number {
  if (totalWeight <= 0) return 0;
  return Math.min(
    MAX_COMPETENCY_PERCENT,
    Math.round((earnedWeight / totalWeight) * MAX_COMPETENCY_PERCENT),
  );
}

function isCourseDone(course: { name: string }, completedSet: Set<string>): boolean {
  return isUserCompletedCourse(course.name, completedSet);
}

type RemainingItem = { name: string; weight: number };

function buildRemainingWithGainLabels(
  remaining: RemainingItem[],
  earnedWeight: number,
  totalWeight: number,
): { name: string; gainLabel: string }[] {
  let simulated = earnedWeight;
  let prev = toWeightedPercent(simulated, totalWeight);

  return remaining.map(({ name, weight }) => {
    simulated += weight;
    const next = toWeightedPercent(simulated, totalWeight);
    const gain = next - prev;
    prev = next;
    return {
      name,
      gainLabel: gain > 0 ? `+${gain}%` : '+0%',
    };
  });
}

export function computeRoadmapProgressStats(
  roadmap: RoadmapPayload | null,
  completedCourseNames: string[],
): RoadmapProgressStats {
  if (!roadmap?.semesterSteps?.length) {
    return {
      totalCourses: 0,
      completedCourseCount: 0,
      earnedCredits: 0,
      totalWeight: 0,
      earnedWeight: 0,
      remainingAll: [],
    };
  }

  const completedSet = toCompletedCourseSet(completedCourseNames);
  let totalCourses = 0;
  let completedCourseCount = 0;
  let earnedCredits = 0;
  let totalWeight = 0;
  let earnedWeight = 0;
  const remaining: RemainingItem[] = [];

  for (const step of roadmap.semesterSteps) {
    for (const course of step.courses) {
      totalCourses += 1;
      const weight = getCourseWeight(course);
      totalWeight += weight;

      const done = isCourseDone(course, completedSet);
      if (done) {
        completedCourseCount += 1;
        earnedWeight += weight;
        earnedCredits += course.credits ?? 3;
      } else {
        remaining.push({ name: course.name, weight });
      }
    }
  }

  const remainingAll = buildRemainingWithGainLabels(remaining, earnedWeight, totalWeight);

  return {
    totalCourses,
    completedCourseCount,
    earnedCredits,
    totalWeight,
    earnedWeight,
    remainingAll,
  };
}

export function computeCompetencyFromRoadmap(
  roadmap: RoadmapPayload | null,
  completedCourseNames: string[],
): CompetencyStats {
  const progress = computeRoadmapProgressStats(roadmap, completedCourseNames);

  if (!roadmap?.semesterSteps?.length) {
    return {
      currentPercent: 0,
      targetPercent: MAX_COMPETENCY_PERCENT,
      remainingCourses: [],
      remainingCount: 0,
    };
  }

  const { earnedWeight, totalWeight, remainingAll } = progress;
  const currentPercent = toWeightedPercent(earnedWeight, totalWeight);
  const targetPercent =
    remainingAll.length > 0
      ? toWeightedPercent(totalWeight, totalWeight)
      : currentPercent;

  return {
    currentPercent,
    targetPercent,
    remainingCourses: remainingAll,
    remainingCount: remainingAll.length,
  };
}
