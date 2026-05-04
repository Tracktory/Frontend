import { useState } from 'react';

import { MOCK_JOB_RECOMMENDATIONS } from '../data/mockRecommendData';
import type { TabKey } from '../pages/recommendation/components/SegmentTab';

export function useRecommendResultViewModel() {
  const [activeTab, setActiveTab] = useState<TabKey>('job');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const jobs = MOCK_JOB_RECOMMENDATIONS;
  const hasData = jobs.length > 0;

  const handleSelectJob = (id: string) => {
    setSelectedJobId((prev) => (prev === id ? null : id));
  };

  return {
    activeTab,
    setActiveTab,
    selectedJobId,
    handleSelectJob,
    jobs,
    hasData,
  };
}
