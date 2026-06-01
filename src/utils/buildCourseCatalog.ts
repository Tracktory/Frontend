import type { ProfileData } from '../api/profileApi';
import type { RecommendResult } from '../api/recommendApi';

export interface CourseCatalogItem {
  subjectId: number;
  name: string;
}

/** 추천 로드맵 + 프로필 이수 과목에서 subjectId·과목명 카탈로그 구성 */
export function buildCourseCatalog(
  recommendResult: RecommendResult | null,
  profile: ProfileData | null
): CourseCatalogItem[] {
  const map = new Map<number, string>();

  recommendResult?.roadmap.semesterSteps.forEach((step) => {
    step.courses.forEach((course) => {
      const subjectId = parseInt(course.id, 10);
      if (!Number.isNaN(subjectId)) {
        map.set(subjectId, course.name);
      }
    });
  });

  profile?.completedSubjects.forEach((subject) => {
    map.set(subject.subjectId, subject.name);
  });

  return Array.from(map.entries())
    .map(([subjectId, name]) => ({ subjectId, name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
}

/** 과목명 → subjectId (프로필 이수 목록 우선, 없으면 카탈로그) */
export function resolveSubjectId(
  name: string,
  profile: ProfileData | null,
  catalog: CourseCatalogItem[]
): number | null {
  const fromProfile = profile?.completedSubjects.find((s) => s.name === name)?.subjectId;
  if (fromProfile != null) return fromProfile;
  const fromCatalog = catalog.find((c) => c.name === name)?.subjectId;
  return fromCatalog ?? null;
}
