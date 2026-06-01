import { useRecommendStore } from '../stores/recommendStore';
import type { JobDetail } from '../data/mockRecommendData';

export function useJobDetailViewModel(jobId: string): { detail: JobDetail | null } {
  const result = useRecommendStore((s) => s.result);

  if (!result) return { detail: null };

  const job = result.jobs.find((j) => j.id === jobId) ?? null;
  return { detail: job };
}
