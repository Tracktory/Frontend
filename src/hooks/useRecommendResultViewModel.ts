import { useState } from 'react';

import { MOCK_JOB_RECOMMENDATIONS } from '../data/mockRecommendData';
import { MOCK_TRACK_RECOMMEND } from '../data/mockTrackRecommendData';
import type { TabKey } from '../pages/recommendation/components/SegmentTab';

export function useRecommendResultViewModel() {
  const [activeTab, setActiveTab] = useState<TabKey>('job');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const jobs = MOCK_JOB_RECOMMENDATIONS;
  const hasData = jobs.length > 0;
  const trackRecommend = MOCK_TRACK_RECOMMEND;

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
    trackRecommend,
  };
}
