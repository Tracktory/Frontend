export type SkillRadarPoint = { subject: string; value: number };

export const SKILL_RADAR: SkillRadarPoint[] = [
  { subject: '데이터분석', value: 82 },
  { subject: '알고리즘', value: 60 },
  { subject: '빅데이터', value: 70 },
  { subject: 'AI/ML', value: 45 },
  { subject: '서버개발', value: 55 },
  { subject: '클라우드', value: 65 },
];

export type SkillComparison = {
  subject: string;
  current: number;
  projected: number;
};

export const SKILL_COMPARISON: SkillComparison[] = [
  { subject: '데이터분석', current: 82, projected: 91 },
  { subject: '알고리즘', current: 60, projected: 78 },
  { subject: '빅데이터', current: 70, projected: 85 },
  { subject: 'AI/ML', current: 45, projected: 73 },
  { subject: '서버개발', current: 55, projected: 78 },
  { subject: '클라우드', current: 65, projected: 82 },
];

export type TrackBarItem = { name: string; value: number; color: string };

export const TRACK_BARS_FALLBACK: TrackBarItem[] = [
  { name: '빅데이터트랙', value: 68, color: '#14B8A6' },
  { name: 'CS트랙', value: 75, color: '#0D9488' },
  { name: 'AI트랙', value: 42, color: '#2DD4BF' },
  { name: 'SW공학', value: 55, color: '#5EEAD4' },
];

export type RemainingCoursePlan = {
  name: string;
  credits: number;
  impact: string;
  sem: string;
  area: string;
};

export const REMAINING_COURSE_PLAN: RemainingCoursePlan[] = [
  { name: '머신러닝', credits: 3, impact: '+8%', sem: '4학기', area: 'AI/ML' },
  { name: '데이터 마이닝', credits: 3, impact: '+7%', sem: '4학기', area: '빅데이터' },
  { name: '서버 프로그래밍', credits: 3, impact: '+8%', sem: '4학기', area: '서버개발' },
  { name: '딥러닝', credits: 3, impact: '+5%', sem: '5학기', area: 'AI/ML' },
  { name: '클라우드 컴퓨팅', credits: 3, impact: '+4%', sem: '5학기', area: '클라우드' },
  { name: '캡스톤 디자인', credits: 3, impact: '+3%', sem: '6학기', area: '종합' },
];

export type AIActionItem = { icon: string; text: string };

export const AI_ACTIONS: AIActionItem[] = [
  { icon: '📌', text: '다음 학기 데이터베이스 수강 시 자료구조 복습을 먼저 진행하세요.' },
  { icon: '🎯', text: 'Backend Developer 92% 매칭 — Spring Boot 토이 프로젝트를 시작하세요.' },
  { icon: '📚', text: '빅데이터트랙 68% 완성 — Kafka 기초 강의를 추가로 이수하면 좋아요.' },
  { icon: '🚀', text: '알고리즘 역량(60%) 강화를 위해 Baekjoon 1일 1문제를 권장합니다.' },
];

export type JobReportEnrichment = {
  icon: string;
  salary: string;
  gap: string[];
};

export const JOB_REPORT_ENRICHMENT: Record<string, JobReportEnrichment> = {
  '데이터 엔지니어': {
    icon: '📦',
    salary: '4,500 ~ 7,500만원',
    gap: ['Spark', 'GCP'],
  },
  '백엔드 개발자': {
    icon: '⚙️',
    salary: '4,200 ~ 7,000만원',
    gap: ['Docker', 'Redis'],
  },
  'MLOps 엔지니어': {
    icon: '🤖',
    salary: '5,000 ~ 9,000만원',
    gap: ['논문 작성', 'JAX'],
  },
  '프론트엔드 개발자': {
    icon: '💻',
    salary: '3,800 ~ 6,500만원',
    gap: ['TypeScript', '성능 최적화'],
  },
  'Backend Developer': {
    icon: '⚙️',
    salary: '4,200 ~ 7,000만원',
    gap: ['Docker', 'Redis'],
  },
  'Data Engineer': {
    icon: '📦',
    salary: '4,500 ~ 7,500만원',
    gap: ['Spark', 'GCP'],
  },
  'AI Researcher': {
    icon: '🤖',
    salary: '5,000 ~ 9,000만원',
    gap: ['논문 작성', 'JAX'],
  },
};

export const PREREQUISITE_WARNING_FALLBACK =
  '알고리즘 수강 전 자료구조를 반드시 이수해야 합니다.\n딥러닝 수강 전 머신러닝 이수가 권장됩니다.';
