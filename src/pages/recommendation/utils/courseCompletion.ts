/** 마이페이지·프로필 이수 과목명만 이수로 인정 (API timing/completed 플래그는 사용하지 않음) */
export function toCompletedCourseSet(completedCourseNames: string[]): Set<string> {
  return new Set(completedCourseNames.map((n) => n.trim()).filter(Boolean));
}

export function isUserCompletedCourse(
  courseName: string,
  completedSet: Set<string>,
): boolean {
  return completedSet.has(courseName.trim());
}
