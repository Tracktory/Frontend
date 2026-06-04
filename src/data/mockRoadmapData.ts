export interface RoadmapCourse {
  id: string;
  /** 과목명 */
  name: string;
  /** LLM 시너지 설명 텍스트 */
  description: string;
  /** 우선순위: 1이 가장 높음 */
  priority: number;
  /** 설정 시 '△ 선수과목: [과목명] 미이수' 경고 배너 표시 */
  prerequisiteUnmet?: string;
}

export interface RoadmapStep {
  stage: 1 | 2 | 3 | 4;
  /** 단계 라벨 (기초 / 핵심 / 응용 / 산학(캡스톤)) */
  label: string;
  courses: RoadmapCourse[];
}

export interface SemesterGuide {
  /** 다음 학기 추천 과목 이름 목록 */
  nextSemester: string[];
  /** 그 다음 학기 추천 과목 이름 목록 */
  afterNextSemester: string[];
}

export type SemesterTiming = 'past' | 'current' | 'future';

/** 학기별 과목 (새 UI용) */
export interface SemesterCourse {
  id: string;
  name: string;
  description: string;
  /** 학점 */
  credits: number;
  /** 역량 기여 가중치 (예: 0~100). API 연동 시 채워짐, 없으면 계산 시 1로 처리 */
  score?: number;
  /** 이수 여부 (API items[].completed) */
  completed?: boolean;
  timing?: SemesterTiming;
  /** 선수과목 목록. API 연동 시 채워짐, mock에서는 undefined */
  prerequisites?: { name: string; completed: boolean; strength: string }[];
}

/** 학기별 단계 (새 UI용) */
export interface SemesterStep {
  year: 1 | 2 | 3 | 4;
  semester: 1 | 2;
  /** past / current / future */
  timing: SemesterTiming;
  /** '기초' | '핵심' | '응용' | '산학' */
  stageLabel: string;
  /** STAGE_COLORS 매핑용 (1=기초, 2=핵심, 3=응용, 4=산학) */
  stageNumber: 1 | 2 | 3 | 4;
  totalCredits: number;
  courses: SemesterCourse[];
}

export interface RoadmapPayload {
  steps: RoadmapStep[];
  semesterSteps: SemesterStep[];
  semesterGuide: SemesterGuide;
  /** 이수과목 등록 시 API가 반환하는 연결 메시지 */
  connectionMessage: string;
}

export interface CourseDetail extends RoadmapCourse {
  stageNumber: 1 | 2 | 3 | 4;
  stageLabel: string;
  detailedDescription: string;
  relatedJobs: string[];
}

export const MOCK_ROADMAP: RoadmapPayload = {
  connectionMessage: 'IT/인터넷·AI/데이터 → 백엔드 개발자 → 데이터사이언스·정보보안 트랙',
  semesterSteps: [
    {
      year: 1, semester: 1, timing: 'past', stageLabel: '기초', stageNumber: 1, totalCredits: 18,
      courses: [
        { id: 's1-1', name: '자료구조개론', description: '자료구조의 기초 개념을 학습합니다', credits: 3, completed: true },
        { id: 's1-2', name: 'C프로그래밍', description: 'C언어를 통한 시스템 프로그래밍 기초', credits: 3, completed: true },
        { id: 's1-3', name: '컴퓨터입문', description: '컴퓨터 과학의 기본 개념을 이해합니다', credits: 3 },
        { id: 's1-4', name: '미적분학', description: '데이터 분석과 머신러닝의 수학적 기초', credits: 3 },
        { id: 's1-5', name: '프로그래밍기초', description: '프로그래밍의 핵심 개념을 학습합니다', credits: 3 },
        { id: 's1-6', name: '디지털논리', description: '컴퓨터 하드웨어의 동작 원리 이해', credits: 3 },
      ],
    },
    {
      year: 1, semester: 2, timing: 'past', stageLabel: '기초', stageNumber: 1, totalCredits: 18,
      courses: [
        { id: 's2-1', name: '이산수학', description: '컴퓨터 과학의 수학적 기반을 다집니다', credits: 3 },
        { id: 's2-2', name: '객체지향프로그래밍', description: 'OOP 패러다임과 설계 원칙 학습', credits: 3 },
        { id: 's2-3', name: '선형대수', description: 'AI·데이터 분석의 핵심 수학 도구', credits: 3 },
        { id: 's2-4', name: '운영체제개론', description: 'OS 구조와 프로세스 관리 이해', credits: 3 },
        { id: 's2-5', name: '확률과통계', description: '데이터 분석을 위한 통계 이론 학습', credits: 3 },
        { id: 's2-6', name: '컴퓨터구조', description: 'CPU, 메모리 등 하드웨어 구조 이해', credits: 3 },
      ],
    },
    {
      year: 2, semester: 1, timing: 'current', stageLabel: '핵심', stageNumber: 2, totalCredits: 18,
      courses: [
        { id: 's3-1', name: '자료구조', description: '배열, 트리, 그래프 등 핵심 자료구조', credits: 3 },
        { id: 's3-2', name: '알고리즘', description: '정렬·탐색·동적프로그래밍 설계 기법', credits: 3 },
        { id: 's3-3', name: '데이터베이스', description: 'SQL과 데이터 모델링 핵심 역량', credits: 3 },
        { id: 's3-4', name: '웹프로그래밍', description: '프론트엔드·백엔드 웹 개발 기초', credits: 3 },
        { id: 's3-5', name: '네트워크', description: 'TCP/IP, HTTP 등 네트워크 프로토콜', credits: 3 },
        { id: 's3-6', name: '소프트웨어공학', description: '소프트웨어 개발 방법론과 설계 원칙', credits: 3 },
      ],
    },
    {
      year: 2, semester: 2, timing: 'future', stageLabel: '핵심', stageNumber: 2, totalCredits: 18,
      courses: [
        { id: 's4-1', name: '운영체제', description: '프로세스, 스레드, 메모리 관리 심화', credits: 3 },
        { id: 's4-2', name: '데이터베이스설계', description: '정규화, 트랜잭션, 쿼리 최적화', credits: 3 },
        { id: 's4-3', name: 'API설계', description: 'RESTful API 설계와 구현 실습', credits: 3 },
        { id: 's4-4', name: '확률모델링', description: '베이지안 추론과 확률적 모델 이해', credits: 3 },
        { id: 's4-5', name: '컴파일러', description: '언어 처리기 설계와 구현 원리', credits: 3 },
        { id: 's4-6', name: '보안개론', description: '암호화, 인증, 보안 취약점 기초', credits: 3 },
      ],
    },
    {
      year: 3, semester: 1, timing: 'future', stageLabel: '응용', stageNumber: 3, totalCredits: 18,
      courses: [
        { id: 's5-1', name: '머신러닝', description: 'ML 알고리즘 설계와 모델 평가', credits: 3 },
        { id: 's5-2', name: '빅데이터개론', description: '대규모 데이터 처리 기술과 도구', credits: 3 },
        { id: 's5-3', name: '클라우드컴퓨팅', description: 'AWS·GCP 기반 클라우드 아키텍처', credits: 3 },
        { id: 's5-4', name: '분산시스템', description: 'Kafka, Spark 등 분산 처리 플랫폼', credits: 3 },
        { id: 's5-5', name: '딥러닝', description: 'CNN, RNN, Transformer 모델 구현', credits: 3 },
        { id: 's5-6', name: '프로젝트실습I', description: '팀 프로젝트를 통한 종합 역량 적용', credits: 3 },
      ],
    },
    {
      year: 3, semester: 2, timing: 'future', stageLabel: '응용', stageNumber: 3, totalCredits: 18,
      courses: [
        { id: 's6-1', name: '데이터분석', description: '실제 데이터셋 분석 파이프라인 구현', credits: 3 },
        { id: 's6-2', name: '시스템보안', description: '침해 대응, 취약점 분석 실무 기법', credits: 3 },
        { id: 's6-3', name: 'MLOps', description: 'ML 모델 배포·모니터링 자동화', credits: 3 },
        { id: 's6-4', name: '자연어처리', description: 'NLP 기술과 LLM 응용 실습', credits: 3 },
        { id: 's6-5', name: '프로젝트실습II', description: '심화 팀 프로젝트 개발 및 발표', credits: 3 },
        { id: 's6-6', name: '컴퓨터비전', description: '이미지 처리와 객체 인식 기술', credits: 3 },
      ],
    },
    {
      year: 4, semester: 1, timing: 'future', stageLabel: '산학', stageNumber: 4, totalCredits: 18,
      courses: [
        { id: 's7-1', name: '종합설계', description: '기업 협력 프로젝트 설계 및 구현', credits: 3 },
        { id: 's7-2', name: '산학협력프로젝트', description: '실무 문제 해결형 캡스톤 프로젝트', credits: 3 },
        { id: 's7-3', name: '기술창업', description: '기술 기반 스타트업 아이디어 구현', credits: 3 },
        { id: 's7-4', name: '데이터엔지니어링실습', description: '데이터 파이프라인 설계 종합 실습', credits: 3 },
        { id: 's7-5', name: '연구방법론', description: '논문 작성과 연구 설계 방법 학습', credits: 3 },
        { id: 's7-6', name: '포트폴리오세미나', description: '취업 포트폴리오 작성과 면접 준비', credits: 3 },
      ],
    },
    {
      year: 4, semester: 2, timing: 'future', stageLabel: '산학', stageNumber: 4, totalCredits: 18,
      courses: [
        { id: 's8-1', name: '졸업프로젝트', description: '4년간 역량을 집결한 최종 졸업 작품', credits: 6 },
        { id: 's8-2', name: '인턴십', description: '기업 현장 실습을 통한 실무 경험', credits: 6 },
        { id: 's8-3', name: '논문세미나', description: '연구 결과 발표와 학술 토론', credits: 3 },
        { id: 's8-4', name: '취업전략', description: '취업 준비와 커리어 개발 전략', credits: 3 },
      ],
    },
  ],
  steps: [
    {
      stage: 1,
      label: '기초',
      courses: [
        {
          id: 'c1-1',
          name: '프로그래밍기초',
          description: '당신의 관심사인 데이터 분석에 기초가 되는 과목입니다',
          priority: 1,
        },
        {
          id: 'c1-2',
          name: '자료구조',
          description: '알고리즘적 사고력의 토대',
          priority: 2,
        },
      ],
    },
    {
      stage: 2,
      label: '핵심',
      courses: [
        {
          id: 'c2-1',
          name: '프로그래밍기초',
          description: '당신의 관심사인 데이터 분석에 기초가 되는 과목입니다',
          priority: 1,
        },
        {
          id: 'c2-2',
          name: '자료구조',
          description: '알고리즘적 사고력의 토대',
          priority: 2,
          prerequisiteUnmet: '프로그래밍기초',
        },
      ],
    },
    {
      stage: 3,
      label: '응용',
      courses: [
        {
          id: 'c3-1',
          name: '프로그래밍기초',
          description: '당신의 관심사인 데이터 분석에 기초가 되는 과목입니다',
          priority: 1,
        },
        {
          id: 'c3-2',
          name: '자료구조',
          description: '알고리즘적 사고력의 토대',
          priority: 2,
        },
      ],
    },
    {
      stage: 4,
      label: '산학(캡스톤)',
      courses: [
        {
          id: 'c4-1',
          name: '프로그래밍기초',
          description: '당신의 관심사인 데이터 분석에 기초가 되는 과목입니다',
          priority: 1,
        },
        {
          id: 'c4-2',
          name: '자료구조',
          description: '알고리즘적 사고력의 토대',
          priority: 2,
        },
      ],
    },
  ],
  semesterGuide: {
    nextSemester: ['자료구조', '알고리즘', '데이터베이스'],
    afterNextSemester: ['머신러닝', '빅데이터개론', '소프트웨어공학'],
  },
};

export const MOCK_COURSE_DETAILS: Record<string, CourseDetail> = {
  'c1-1': {
    ...MOCK_ROADMAP.steps[0].courses[0],
    stageNumber: 1,
    stageLabel: '기초',
    detailedDescription:
      '변수, 조건문, 반복문, 함수 등 프로그래밍의 핵심 개념을 학습합니다. 데이터 분석 및 알고리즘 설계의 토대가 되는 필수 과목입니다.',
    relatedJobs: ['데이터 엔지니어', '백엔드 개발자', 'MLOps 엔지니어', '프론트엔드 개발자'],
  },
  'c1-2': {
    ...MOCK_ROADMAP.steps[0].courses[1],
    stageNumber: 1,
    stageLabel: '기초',
    detailedDescription:
      '배열, 연결 리스트, 스택, 큐, 트리 등 다양한 자료구조를 이해하고 활용합니다. 효율적인 알고리즘 설계를 위한 기초 역량을 기릅니다.',
    relatedJobs: ['데이터 엔지니어', '백엔드 개발자'],
  },
  'c2-1': {
    ...MOCK_ROADMAP.steps[1].courses[0],
    stageNumber: 2,
    stageLabel: '핵심',
    detailedDescription:
      '객체지향 프로그래밍, 예외 처리, 파일 입출력 등 심화 개념을 다룹니다. 실제 프로젝트에 활용 가능한 수준의 프로그래밍 역량을 키웁니다.',
    relatedJobs: ['백엔드 개발자', '프론트엔드 개발자'],
  },
  'c2-2': {
    ...MOCK_ROADMAP.steps[1].courses[1],
    stageNumber: 2,
    stageLabel: '핵심',
    detailedDescription:
      '정렬, 탐색, 그래프 등 핵심 알고리즘을 구현하고 시간/공간 복잡도를 분석합니다. 코딩 테스트 및 실무 문제 해결 역량을 기릅니다.',
    relatedJobs: ['데이터 엔지니어', 'MLOps 엔지니어'],
  },
  'c3-1': {
    ...MOCK_ROADMAP.steps[2].courses[0],
    stageNumber: 3,
    stageLabel: '응용',
    detailedDescription:
      '실제 데이터셋을 활용한 프로그래밍 실습을 진행합니다. 데이터 전처리, 시각화, 간단한 분석 파이프라인 구현 능력을 기릅니다.',
    relatedJobs: ['데이터 엔지니어', 'MLOps 엔지니어'],
  },
  'c3-2': {
    ...MOCK_ROADMAP.steps[2].courses[1],
    stageNumber: 3,
    stageLabel: '응용',
    detailedDescription:
      '고급 자료구조(힙, 해시맵, 트라이 등)와 동적 프로그래밍을 학습합니다. 복잡한 시스템 설계에 필요한 알고리즘 역량을 완성합니다.',
    relatedJobs: ['백엔드 개발자', 'MLOps 엔지니어'],
  },
  'c4-1': {
    ...MOCK_ROADMAP.steps[3].courses[0],
    stageNumber: 4,
    stageLabel: '산학(캡스톤)',
    detailedDescription:
      '산학 협력 프로젝트를 통해 실제 기업 문제를 프로그래밍으로 해결합니다. 팀 협업, 코드 리뷰, 발표 등 실무 역량을 종합적으로 평가받습니다.',
    relatedJobs: ['데이터 엔지니어', '백엔드 개발자', 'MLOps 엔지니어', '프론트엔드 개발자'],
  },
  'c4-2': {
    ...MOCK_ROADMAP.steps[3].courses[1],
    stageNumber: 4,
    stageLabel: '산학(캡스톤)',
    detailedDescription:
      '캡스톤 프로젝트에서 자료구조 및 알고리즘을 실제 문제에 적용합니다. 성능 최적화와 시스템 설계 역량을 실전 프로젝트로 검증합니다.',
    relatedJobs: ['데이터 엔지니어', '백엔드 개발자'],
  },
};
