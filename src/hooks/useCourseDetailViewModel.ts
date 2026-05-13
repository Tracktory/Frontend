import { MOCK_COURSE_DETAILS, CourseDetail } from '../data/mockRoadmapData';

export function useCourseDetailViewModel(courseId: string): { detail: CourseDetail | null } {
  const detail = MOCK_COURSE_DETAILS[courseId] ?? null;
  return { detail };
}
