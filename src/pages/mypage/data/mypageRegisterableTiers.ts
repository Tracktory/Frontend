export type MypageCourseTier = {
  id: string;
  label: string;
  courses: string[];
};

export const MYPAGE_REGISTERABLE_TIERS: MypageCourseTier[] = [
  {
    id: 'tier1',
    label: 'Tier 1 · 기초',
    courses: [
      '프로그래밍 기초',
      '자료구조',
      '컴퓨터구조',
      '이산수학',
      '선형대수',
    ],
  },
  {
    id: 'tier2',
    label: 'Tier 2 · 핵심',
    courses: [
      '객체지향프로그래밍',
      '운영체제',
      '데이터베이스',
      '알고리즘',
      '컴퓨터네트워크',
    ],
  },
  {
    id: 'tier3',
    label: 'Tier 3 · 응용',
    courses: [
      '파이썬 프로그래밍',
      '웹 프로그래밍',
      '머신러닝',
      '모바일 앱 개발',
      '소프트웨어 공학',
    ],
  },
  {
    id: 'tier4',
    label: 'Tier 4 · 심화',
    courses: [
      '딥러닝',
      '클라우드 컴퓨팅',
      '빅데이터 처리',
      '정보보안',
      '캡스톤디자인',
    ],
  },
];
