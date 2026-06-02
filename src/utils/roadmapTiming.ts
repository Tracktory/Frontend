import type { SemesterStep, SemesterTiming } from '../data/mockRoadmapData';

function resolveSemesterTiming(
  year: number,
  semester: number,
  studentGrade: number,
  currentSemester: 1 | 2
): SemesterTiming {
  if (year < studentGrade) return 'past';
  if (year > studentGrade) return 'future';
  if (semester < currentSemester) return 'past';
  if (semester === currentSemester) return 'current';
  return 'future';
}

/** 학생 학년 기준으로 학기 timing 재계산 (API past가 1학년 학기에 잘못 붙는 경우 보정) */
export function applyStudentGradeToSemesterSteps(
  steps: SemesterStep[],
  studentGrade: number | null,
  currentSemester: 1 | 2 = 1
): SemesterStep[] {
  if (studentGrade == null || studentGrade < 1) return steps;

  return steps.map((step) => {
    const timing = resolveSemesterTiming(
      step.year,
      step.semester,
      studentGrade,
      currentSemester
    );
    return {
      ...step,
      timing,
      courses: step.courses.map((c) => ({
        ...c,
        timing: c.timing === 'past' && timing !== 'past' ? timing : (c.timing ?? timing),
      })),
    };
  });
}
