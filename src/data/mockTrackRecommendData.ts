export interface PrimaryTrack {
  rank: 1 | 2;
  title: string;
  rankLabel: string;
  score?: number | null;
  reasoning?: string | null;
  coreSubjects: string[];
  relatedJobs: string[];
}

export interface SecondaryTrack {
  id: string;
  name: string;
  score?: number | null;
  reasoning?: string | null;
}

export interface TrackRecommendPayload {
  combinationScore?: number;
  combinationReasoning: string;
  primary: PrimaryTrack[];
  secondary: SecondaryTrack[];
  llmSynergy: string;
  trackDescription: string;
  requiredCourses: string[];
  prerequisiteNote: string;
}

export const MOCK_TRACK_RECOMMEND: TrackRecommendPayload = {
  combinationScore: 87,
  combinationReasoning:
    '빅데이터와 컴퓨터공학 트랙을 병행하면 데이터 파이프라인 설계와 시스템 구현 역량을 동시에 키울 수 있습니다.',
  primary: [
    {
      rank: 1,
      title: '빅데이터 트랙',
      rankLabel: '1트랙·주전공',
      score: 92,
      reasoning: 'AI/데이터 흥미와 100% 일치',
      coreSubjects: ['빅데이터개론', '데이터마이닝', '머신러닝'],
      relatedJobs: ['데이터 엔지니어', 'ML 엔지니어'],
    },
    {
      rank: 2,
      title: '컴퓨터공학 트랙',
      rankLabel: '2트랙',
      score: 82,
      reasoning: '백엔드 진로의 기반 트랙',
      coreSubjects: ['자료구조', '운영체제', '네트워크'],
      relatedJobs: ['백엔드 개발자', '시스템 엔지니어'],
    },
  ],
  secondary: [
    {
      id: 's1',
      name: '한국어교육 트랙 × 빅데이터',
      score: 75,
      reasoning: '자연어처리 특화 조합',
    },
    {
      id: 's2',
      name: '디지털마케팅 트랙',
      score: 68,
      reasoning: '데이터 기반 마케터로 확장',
    },
    {
      id: 's3',
      name: '데이터사이언스 트랙',
      score: 65,
      reasoning: '통계·분석 역량 강화',
    },
  ],
  llmSynergy:
    '웹 공학 트랙과 AI 트랙을 함께 수강하면 백엔드 기반 위에 AI 역량을 쌓을 수 있어, 데이터 기반 웹 서비스 구축에 유리합니다.',
  trackDescription:
    '선택한 직무와 흥미 분야를 바탕으로, 단과대 커리큘럼과 선수·전필 구조를 고려해 추천 트랙을 구성했습니다.',
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
