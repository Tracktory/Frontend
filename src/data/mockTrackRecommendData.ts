export interface TrackSubjectRef {
  code?: string;
  name: string;
}

export interface PrimaryTrack {
  rank: 1 | 2;
  title: string;
  rankLabel: string;
  score?: number | null;
  reasoning?: string | null;
  mainSubjects: TrackSubjectRef[];
  coreSubjects: string[];
  relatedJobs: string[];
}

export interface SecondaryTrack {
  id: string;
  name: string;
  score?: number | null;
  reasoning?: string | null;
  isCrossCombination?: boolean;
  mainSubjects: TrackSubjectRef[];
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
      mainSubjects: [
        { code: 'BD101', name: '빅데이터개론' },
        { code: 'BD201', name: '데이터마이닝' },
        { code: 'BD301', name: '머신러닝' },
      ],
      coreSubjects: ['빅데이터개론', '데이터마이닝', '머신러닝'],
      relatedJobs: ['데이터 엔지니어', 'ML 엔지니어'],
    },
    {
      rank: 2,
      title: '컴퓨터공학 트랙',
      rankLabel: '2트랙',
      score: 82,
      reasoning: '백엔드 진로의 기반 트랙',
      mainSubjects: [
        { code: 'CS201', name: '자료구조' },
        { code: 'CS301', name: '운영체제' },
        { code: 'CS302', name: '네트워크' },
      ],
      coreSubjects: ['자료구조', '운영체제', '네트워크'],
      relatedJobs: ['백엔드 개발자', '시스템 엔지니어'],
    },
  ],
  secondary: [
    {
      id: 's1',
      name: '국어교육 × 빅데이터',
      score: 75,
      reasoning: '한글 NLP·텍스트 분석 직무에 강점이 있는 융합 조합입니다.',
      isCrossCombination: true,
      mainSubjects: [
        { name: '국어교육학개론' },
        { name: '자연어처리' },
        { name: '텍스트마이닝' },
      ],
    },
    {
      id: 's2',
      name: '경영학 × 컴퓨터공학',
      score: 72,
      reasoning: '핀테크·데이터 기반 비즈니스 개발에 적합한 조합입니다.',
      isCrossCombination: true,
      mainSubjects: [
        { name: '경영정보시스템' },
        { name: '데이터베이스' },
        { name: '서비스기획' },
      ],
    },
    {
      id: 's3',
      name: '심리학 × AI',
      score: 70,
      reasoning: 'HCI/UX·사용자 행동 분석 직무에 연결됩니다.',
      isCrossCombination: true,
      mainSubjects: [
        { name: '인지심리학' },
        { name: 'HCI' },
        { name: '머신러닝' },
      ],
    },
    {
      id: 's4',
      name: '수학 × 컴퓨터공학',
      score: 68,
      reasoning: '알고리즘·최적화 엔지니어 진로에 유리합니다.',
      isCrossCombination: true,
      mainSubjects: [
        { name: '선형대수학' },
        { name: '알고리즘' },
        { name: '이산수학' },
      ],
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
