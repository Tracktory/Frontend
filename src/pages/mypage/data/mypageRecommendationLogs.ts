export type RecommendationLogTag = '완료' | '분석' | '추천';

export type RecommendationLog = {
  id: string;
  date: string;
  title: string;
  desc: string;
  tag: RecommendationLogTag;
};

export const MYPAGE_RECOMMENDATION_LOGS: RecommendationLog[] = [
  {
    id: '1',
    date: '2026.06.02',
    title: '3학기 수강 추천',
    desc: '데이터베이스, 알고리즘, 빅데이터 입문',
    tag: '완료',
  },
  {
    id: '2',
    date: '2026.05.15',
    title: '직무 역량 분석',
    desc: 'Backend Developer 92% 매칭',
    tag: '분석',
  },
  {
    id: '3',
    date: '2026.04.10',
    title: '트랙 최적화 제안',
    desc: '빅데이터 + CS 시너지 87점',
    tag: '추천',
  },
];
