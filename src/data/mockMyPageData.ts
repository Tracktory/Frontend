/** 마이 페이지 — 이수 과목 초기 목업(API 연동 전) */
export const MOCK_COMPLETED_COURSES = ['자료구조', '알고리즘', '데이터베이스'];

export interface RecommendationHistoryItem {
  id: string;
  title: string;
  /** 표시 형식 예: `2026.04.17` */
  date: string;
}

/** 마이 페이지 — 추천 이력 목업 */
export const MOCK_RECOMMENDATION_HISTORY: RecommendationHistoryItem[] = [
  { id: 'h1', title: '최신 추천', date: '2026.04.17' },
  { id: 'h2', title: '이전 추천', date: '2026.04.17' },
];
