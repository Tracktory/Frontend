import { MOCK_JOB_DETAILS, JobDetail } from '../data/mockRecommendData';

export function useJobDetailViewModel(jobId: string): { detail: JobDetail | null } {
  const detail = MOCK_JOB_DETAILS[jobId] ?? null;
  return { detail };
}
