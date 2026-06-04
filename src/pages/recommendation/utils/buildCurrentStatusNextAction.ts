import type { CompetencyStats } from './journeyCompetency';

const SEMESTER_PATTERN = /^\d+-\d+$/;

const ENCOURAGEMENT_TEMPLATE =
  '벌써 {label}학기이네요. 학교 공부 외에도 다양한 대외활동/동아리 활동 혹은 온라인 강의(e.g. 인프런)도 해보는건 어때요?';

export function buildCurrentStatusNextAction(
  currentSemesterLabel: string,
  stats: Pick<CompetencyStats, 'remainingCourses'>,
): string {
  if (SEMESTER_PATTERN.test(currentSemesterLabel)) {
    return ENCOURAGEMENT_TEMPLATE.replace('{label}', currentSemesterLabel);
  }

  const firstRemaining = stats.remainingCourses[0];
  if (firstRemaining?.name) {
    return `${firstRemaining.name} 등 추천 과목을 다음 학기에 수강해 보세요.`;
  }

  return '학습 로드맵에서 다음 학기 추천 과목을 확인해 보세요.';
}
