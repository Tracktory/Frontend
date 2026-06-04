import type { RoadmapPayload } from '../../../data/mockRoadmapData';

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
  remainingAll: { name: string; gainLabel: string }[];
};

function toDisplayPercent(completedCount: number, totalCourses: number): number {
  if (totalCourses <= 0) return 0;
  return Math.round((completedCount / totalCourses) * MAX_COMPETENCY_PERCENT);
}

function isCourseDone(
  course: { name: string; completed?: boolean },
  completedSet: Set<string>,
): boolean {
  return course.completed === true || completedSet.has(course.name);
}

function buildRemainingWithGainLabels(
  remainingNames: string[],
  completedCourseCount: number,
  totalCourses: number,
): { name: string; gainLabel: string }[] {
  let simulated = completedCourseCount;
  let prev = toDisplayPercent(simulated, totalCourses);

  return remainingNames.map((name) => {
    simulated += 1;
    const next = toDisplayPercent(simulated, totalCourses);
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
      remainingAll: [],
    };
  }

  const completedSet = new Set(completedCourseNames.map((n) => n.trim()));
  let totalCourses = 0;
  let completedCourseCount = 0;
  let earnedCredits = 0;
  const remainingNames: string[] = [];

  for (const step of roadmap.semesterSteps) {
    for (const course of step.courses) {
      totalCourses += 1;
      const done = isCourseDone(course, completedSet);
      if (done) {
        completedCourseCount += 1;
        earnedCredits += course.credits ?? 3;
      } else {
        remainingNames.push(course.name);
      }
    }
  }

  const remainingAll = buildRemainingWithGainLabels(
    remainingNames,
    completedCourseCount,
    totalCourses,
  );

  return {
    totalCourses,
    completedCourseCount,
    earnedCredits,
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

  const { totalCourses, completedCourseCount, remainingAll } = progress;
  const currentPercent = toDisplayPercent(completedCourseCount, totalCourses);
  const targetPercent =
    remainingAll.length > 0
      ? toDisplayPercent(completedCourseCount + remainingAll.length, totalCourses)
      : currentPercent;

  return {
    currentPercent,
    targetPercent,
    remainingCourses: remainingAll,
    remainingCount: remainingAll.length,
  };
}
