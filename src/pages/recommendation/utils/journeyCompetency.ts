import type { RoadmapPayload } from '../../../data/mockRoadmapData';

export type CompetencyStats = {
  currentPercent: number;
  targetPercent: number;
  remainingCourses: { name: string; gainLabel: string }[];
  remainingCount: number;
};

export function computeCompetencyFromRoadmap(
  roadmap: RoadmapPayload | null,
  completedCourseNames: string[]
): CompetencyStats {
  if (!roadmap?.semesterSteps?.length) {
    return {
      currentPercent: 0,
      targetPercent: 95,
      remainingCourses: [],
      remainingCount: 0,
    };
  }

  const completedSet = new Set(completedCourseNames.map((n) => n.trim()));
  let total = 0;
  let done = 0;
  const remaining: { name: string; gainLabel: string }[] = [];

  for (const step of roadmap.semesterSteps) {
    for (const course of step.courses) {
      total += 1;
      const isDone =
        course.completed === true ||
        completedSet.has(course.name) ||
        step.timing === 'past';
      if (isDone) {
        done += 1;
      } else if (remaining.length < 6) {
        remaining.push({ name: course.name, gainLabel: '+7-8%' });
      }
    }
  }

  const currentPercent = total > 0 ? Math.round((done / total) * 100) : 0;
  const targetPercent = Math.min(95, currentPercent + remaining.length * 7 + 5);

  return {
    currentPercent,
    targetPercent,
    remainingCourses: remaining.slice(0, 3),
    remainingCount: remaining.length,
  };
}
