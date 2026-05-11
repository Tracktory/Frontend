/** 마이 페이지 — 이수 과목 초기 목업(API 연동 전) */
export const MOCK_COMPLETED_COURSES = ['자료구조', '알고리즘', '데이터베이스'];

/**
 * 과목 추가 시 선택 가능한 목록 (학사 API 전 목업).
 * 이미 이수 목록에 있는 항목은 시트에서 제외.
 */
export const COURSE_CATALOG_FOR_SELECTION: string[] = [
  '자료구조',
  '알고리즘',
  '데이터베이스',
  '프로그래밍기초',
  '이산수학',
  '선형대수',
  '확률과통계',
  '운영체제',
  '컴퓨터구조',
  '네트워크',
  '소프트웨어공학',
  '웹프로그래밍',
  '머신러닝',
  '빅데이터개론',
  '클라우드컴퓨팅',
  '정보보안',
  '모바일프로그래밍',
  '캡스톤디자인',
];

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
