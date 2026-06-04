import type { RoadmapPayload } from '../../../data/mockRoadmapData';

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

function isCourseDone(
  course: { name: string; completed?: boolean },
  stepTiming: string,
  completedSet: Set<string>,
): boolean {
  return (
    course.completed === true ||
    completedSet.has(course.name) ||
    stepTiming === 'past'
  );
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
  const remainingAll: { name: string; gainLabel: string }[] = [];

  for (const step of roadmap.semesterSteps) {
    for (const course of step.courses) {
      totalCourses += 1;
      const done = isCourseDone(course, step.timing, completedSet);
      if (done) {
        completedCourseCount += 1;
        earnedCredits += course.credits ?? 3;
      } else if (remainingAll.length < 6) {
        remainingAll.push({ name: course.name, gainLabel: '+7-8%' });
      }
    }
  }

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
      targetPercent: 95,
      remainingCourses: [],
      remainingCount: 0,
    };
  }

  const { totalCourses, completedCourseCount, remainingAll } = progress;
  const currentPercent =
    totalCourses > 0 ? Math.round((completedCourseCount / totalCourses) * 100) : 0;
  const targetPercent = Math.min(
    95,
    currentPercent + remainingAll.length * 7 + 5,
  );

  return {
    currentPercent,
    targetPercent,
    remainingCourses: remainingAll.slice(0, 3),
    remainingCount: remainingAll.length,
  };
}
