import type { JobRecommendation } from '../../../data/mockRecommendData';

export type ExplorationJobCard = {
  id: string;
  title: string;
  matchScore: number;
  reason: string;
};

export const EXPLORATION_JOB_MOCK: ExplorationJobCard[] = [
  {
    id: 'explore-1',
    title: 'Data Scientist',
    matchScore: 85,
    reason: 'AI와 수학 관심사가 잘 맞아요',
  },
  {
    id: 'explore-2',
    title: 'Backend Developer',
    matchScore: 78,
    reason: '시스템 설계에 흥미를 보이셨어요',
  },
  {
    id: 'explore-3',
    title: 'UX Researcher',
    matchScore: 72,
    reason: '사용자 분석에 강점이 있어요',
  },
];

export function mapJobsToExplorationCards(
  jobs: JobRecommendation[],
): ExplorationJobCard[] {
  if (jobs.length === 0) return EXPLORATION_JOB_MOCK;

  return jobs.slice(0, 3).map((job) => ({
    id: job.id,
    title: job.title,
    matchScore: job.matchScore,
    reason: job.reasoning?.trim() || job.description?.trim() || '관심사와 잘 맞는 직무예요',
  }));
}
