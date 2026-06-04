/** 현재 학습 현황 — 다음 액션 목데이터 (recommendationId 순환) */
export const CURRENT_STATUS_NEXT_ACTIONS: readonly string[] = [
  '이번 학기 로드맵의 핵심 과목부터 차근차근 챙겨보세요. 작은 목표를 세우면 진행이 한눈에 보여요.',
  '학교 수업 외에 인프런·K-MOOC 같은 온라인 강의로 부족한 스택을 메우는 것도 좋은 선택이에요.',
  '동아리 활동이나 공모전에 참여해 포트폴리오를 쌓아보세요. 실전 경험이 취업 준비에 큰 도움이 됩니다.',
  '다음 학기 전필·선수과목 이수 여부를 미리 확인해 두면 수강 신청이 훨씬 수월해져요.',
  '관심 직무와 연결된 사이드 프로젝트를 하나 정해 보세요. 트랙 시너지가 더 분명해질 거예요.',
  '이수한 과목을 마이페이지에 최신으로 맞춰 두면 역량 커버리지와 추천이 더 정확해져요.',
  '스터디나 멘토링 프로그램에 참여해 또래·선배와 학습 루틴을 공유해 보세요.',
  '직무 매칭에 나온 관심 직무의 기술 스택을 골라, 주 1회 정도 공부하는 시간을 가져보세요.',
];

export function getNextActionMessageForRecommendationId(
  recommendationId: number | null | undefined,
): string {
  const list = CURRENT_STATUS_NEXT_ACTIONS;
  if (list.length === 0) {
    return '학습 로드맵에서 다음 학기 추천 과목을 확인해 보세요.';
  }
  if (recommendationId == null || recommendationId <= 0) {
    return list[0];
  }
  const index = (recommendationId - 1) % list.length;
  return list[index];
}
