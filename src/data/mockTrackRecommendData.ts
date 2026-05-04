export interface PrimaryTrack {
  rank: 1 | 2;
  title: string;
  coreSubjects: string;
  relatedJobs: string[];
  /** true: primary border + light bg (1st), false: muted card (2nd) */
  emphasized: boolean;
}

export interface SecondaryTrack {
  id: string;
  name: string;
  emphasized: boolean;
}

export interface TrackRecommendPayload {
  primary: PrimaryTrack[];
  secondary: SecondaryTrack[];
  llmSynergy: string;
  trackDescription: string;
  requiredCourses: string[];
  prerequisiteNote: string;
}

export const MOCK_TRACK_RECOMMEND: TrackRecommendPayload = {
  primary: [
    {
      rank: 1,
      title: '웹 공학 트랙',
      coreSubjects: '핵심과목 : 웹프로그래밍, 데이터베이스, 소프트웨어공학',
      relatedJobs: ['백엔드 개발자', '풀스택 개발자'],
      emphasized: true,
    },
    {
      rank: 2,
      title: 'AI트랙',
      coreSubjects: '핵심과목 : 머신러닝, 딥러닝, 데이터마이닝',
      relatedJobs: ['데이터 엔지니어', 'ML 엔지니어'],
      emphasized: false,
    },
  ],
  secondary: [
    { id: 's1', name: '빅데이터 트랙', emphasized: false },
    { id: 's2', name: '모바일소프트웨어 트랙', emphasized: false },
    { id: 's3', name: '컴퓨터공학 트랙', emphasized: true },
    { id: 's4', name: '사이버보안 트랙', emphasized: false },
    { id: 's5', name: '클라우드컴퓨팅 트랙', emphasized: true },
  ],
  llmSynergy:
    '웹 공학 트랙과 AI 트랙을 함께 수강하면 백엔드 기반 위에 AI 역량을 쌓을 수 있어, 데이터 기반 웹 서비스 구축에 유리합니다. 다만 저학년 때 선수로 이수해야 할 수학·통계 과목을 미리 챙기는 것이 중요합니다.',
  trackDescription:
    '선택한 직무와 흥미 분야를 바탕으로, 단과대 커리큘럼과 선수·전필 구조를 고려해 추천 트랙을 구성했습니다. 실제 수강은 학사 안내 및 트랙 운영 규정을 확인해 주세요.',
  requiredCourses: [
    '웹프로그래밍',
    '데이터베이스',
    '소프트웨어공학',
    '자료구조',
    '알고리즘',
  ],
  prerequisiteNote:
    '선수과목: 이산수학, 확률과 통계, 프로그래밍기초를 이수한 뒤 전필 과목 수강을 권장합니다.',
};
