import { useRecommendStore } from '../stores/recommendStore';
import type { JobDetail } from '../data/mockRecommendData';

export function useJobDetailViewModel(jobId: string): { detail: JobDetail | null } {
  const result = useRecommendStore((s) => s.result);

  if (!result) return { detail: null };

  const job = result.jobs.find((j) => j.id === jobId) ?? null;
  if (!job) return { detail: null };

  const relatedTracks = result.trackRecommend.primary
    .filter((t) => t.relatedJobs.includes(job.title))
    .map((t) => ({ name: t.title, description: t.coreSubjects }));

  const detail: JobDetail = {
    ...job,
    detailedDescription: job.description,
    coreSkills: job.techStack,
    advancedSkills: [],
    relatedTracks,
  };

  return { detail };
}
