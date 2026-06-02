import type { SemesterStep, SemesterTiming } from '../data/mockRoadmapData';

const MAX_GRADE_YEAR = 4;
const SEMESTERS_PER_YEAR = 2;

export type RemainingSemestersInfo = {
  remainingSemesters: number;
  semesterRange: string;
};

/** profile.currentYear 기준 잔여 학기 (4학년 2학기까지, 현재 학기 포함) */
export function computeRemainingSemestersFromCurrentYear(
  currentYear: number | null | undefined,
  currentSemester: 1 | 2 = 1
): RemainingSemestersInfo {
  if (
    currentYear == null ||
    currentYear < 1 ||
    currentYear > MAX_GRADE_YEAR ||
    currentSemester < 1 ||
    currentSemester > SEMESTERS_PER_YEAR
  ) {
    return { remainingSemesters: 0, semesterRange: '' };
  }

  const startIndex = (currentYear - 1) * SEMESTERS_PER_YEAR + currentSemester;
  const endIndex = MAX_GRADE_YEAR * SEMESTERS_PER_YEAR;
  const remainingSemesters = endIndex - startIndex + 1;
  const semesterRange = `${currentYear}학년 ${currentSemester}학기 ~ ${MAX_GRADE_YEAR}학년 2학기`;

  return { remainingSemesters, semesterRange };
}

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
