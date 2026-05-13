//하드코딩 용도 - api 연동 전 데이터 테스트 용

export interface JobRecommendation {
  id: string;
  title: string;
  description: string;
  matchScore: number;
  techStack: string[];
  techStackReady: boolean;
}

export interface JobDetail extends JobRecommendation {
  detailedDescription: string;
  coreSkills: string[];
  advancedSkills: string[];
  relatedTracks: { name: string; description: string }[];
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

export const MOCK_JOB_DETAILS: Record<string, JobDetail> = {
  '1': {
    ...MOCK_JOB_RECOMMENDATIONS[0],
    detailedDescription:
      '대규모 데이터의 수집, 저장, 처리 파이프라인을 설계하고 관리하는 역할입니다. 데이터 기반 의사결정을 위한 인프라를 구축합니다.',
    coreSkills: ['SQL', 'Python', 'ETL 설계', '데이터 분석', '데이터모델링', '클라우드 (AWS/GCP)'],
    advancedSkills: ['Apache Spark', 'Airflow', 'PostgreSQL', 'Docker', 'Kafka'],
    relatedTracks: [
      { name: '웹공학트랙 + AI트랙', description: '데이터 파이프라인과 ML 모델 연동에 최적' },
    ],
  },
  '2': {
    ...MOCK_JOB_RECOMMENDATIONS[1],
    detailedDescription:
      'RESTful API 설계부터 서버 인프라 운영까지 담당합니다. 대용량 트래픽 처리와 안정적인 서비스 운영을 위한 백엔드 시스템을 구축합니다.',
    coreSkills: ['Java', 'Spring Boot', 'REST API 설계', 'SQL', '인증/인가', '클라우드 (AWS)'],
    advancedSkills: ['Redis', 'Kafka', 'Docker', 'Kubernetes', 'CI/CD'],
    relatedTracks: [
      { name: '웹공학트랙', description: '웹 서버 및 API 개발 핵심 과목 집중 이수' },
    ],
  },
  '3': {
    ...MOCK_JOB_RECOMMENDATIONS[2],
    detailedDescription:
      '머신러닝 모델의 학습, 배포, 모니터링 파이프라인을 자동화합니다. 데이터 과학 팀과 개발 팀 사이를 연결하는 역할을 수행합니다.',
    coreSkills: ['Python', 'ML 파이프라인', 'Docker', '모델 서빙', 'CI/CD', '모니터링'],
    advancedSkills: ['Kubernetes', 'MLflow', 'Kubeflow', 'Prometheus', 'Grafana'],
    relatedTracks: [
      { name: 'AI트랙 + 빅데이터트랙', description: 'ML 모델 운영과 데이터 처리 역량 동시 확보' },
    ],
  },
  '4': {
    ...MOCK_JOB_RECOMMENDATIONS[3],
    detailedDescription:
      '사용자 인터페이스를 설계하고 구현합니다. 반응형 웹 애플리케이션 개발과 최적의 사용자 경험 제공을 목표로 합니다.',
    coreSkills: ['HTML/CSS', 'JavaScript', 'React', '상태관리', 'REST API 연동', '반응형 디자인'],
    advancedSkills: ['TypeScript', 'Next.js', 'Testing', 'WebGL', 'CI/CD'],
    relatedTracks: [
      { name: '웹공학트랙', description: '프론트엔드 개발에 필요한 웹 기술 전반 학습' },
    ],
  },
};
