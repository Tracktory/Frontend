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

export interface RoadmapPayload {
  steps: RoadmapStep[];
  semesterGuide: SemesterGuide;
}

export interface CourseDetail extends RoadmapCourse {
  stageNumber: 1 | 2 | 3 | 4;
  stageLabel: string;
  detailedDescription: string;
  relatedJobs: string[];
}

export const MOCK_ROADMAP: RoadmapPayload = {
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
