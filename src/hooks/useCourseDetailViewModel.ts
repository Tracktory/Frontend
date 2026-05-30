import { useRecommendStore } from '../stores/recommendStore';
import type { CourseDetail } from '../data/mockRoadmapData';

export function useCourseDetailViewModel(courseId: string): { detail: CourseDetail | null } {
  const result = useRecommendStore((s) => s.result);
  if (!result) return { detail: null };

  let foundCourse = null;
  let foundStep = null;
  for (const step of result.roadmap.semesterSteps) {
    const c = step.courses.find((c) => c.id === courseId);
    if (c) {
      foundCourse = c;
      foundStep = step;
      break;
    }
  }
  if (!foundCourse || !foundStep) return { detail: null };

  // priority: 같은 학기 내 score 내림차순 순위 (1-based)
  const sorted = [...foundStep.courses].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const priority = sorted.findIndex((c) => c.id === courseId) + 1;

  // prerequisiteUnmet: 첫 미이수 필수 선수과목
  const unmet = foundCourse.prerequisites?.find(
    (p) => p.strength === 'required' && !p.completed
  );

  // relatedJobs: primary 트랙 전체 relatedJobs 합집합
  const relatedJobs = [
    ...new Set(result.trackRecommend.primary.flatMap((t) => t.relatedJobs)),
  ];

  const detail: CourseDetail = {
    id: foundCourse.id,
    name: foundCourse.name,
    description: foundCourse.description,
    priority,
    prerequisiteUnmet: unmet?.name,
    stageNumber: foundStep.stageNumber,
    stageLabel: foundStep.stageLabel,
    detailedDescription: foundCourse.description,
    relatedJobs,
  };

  return { detail };
}
