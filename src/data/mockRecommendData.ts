//하드코딩 용도 - api 연동 전 데이터 테스트 용

export interface JobRecommendation {
  id: string;
  title: string;
  description: string;
  matchScore: number;
  techStack: string[];
  techStackReady: boolean;
}

export const MOCK_JOB_RECOMMENDATIONS: JobRecommendation[] = [
  {
    id: '1',
    title: '데이터 엔지니어',
    description: '데이터 파이프라인 설계 및 관리',
    matchScore: 92,
    techStack: ['Python', 'SQL', 'Spark'],
    techStackReady: true,
  },
  {
    id: '2',
    title: '백엔드 개발자',
    description: '서버/API 설계 및 개발',
    matchScore: 88,
    techStack: ['Java', 'Spring', 'AWS'],
    techStackReady: true,
  },
  {
    id: '3',
    title: 'MLOps 엔지니어',
    description: 'ML 모델 배포 및 운영 자동화',
    matchScore: 85,
    techStack: ['Python', 'Docker', 'K8s'],
    techStackReady: true,
  },
  {
    id: '4',
    title: '프론트엔드 개발자',
    description: 'UI/UX 구현 및 웹 애플리케이션 개발',
    matchScore: 78,
    techStack: [],
    techStackReady: false,
  },
];
