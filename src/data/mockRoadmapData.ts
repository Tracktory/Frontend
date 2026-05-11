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
