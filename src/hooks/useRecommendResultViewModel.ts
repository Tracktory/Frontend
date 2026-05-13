import { useState } from 'react';
import type { NavigationProp } from '@react-navigation/native';

import { MOCK_JOB_RECOMMENDATIONS } from '../data/mockRecommendData';
import { MOCK_TRACK_RECOMMEND } from '../data/mockTrackRecommendData';
import { MOCK_ROADMAP } from '../data/mockRoadmapData';
import type { RoadmapPayload } from '../data/mockRoadmapData';
import type { TabKey } from '../pages/recommendation/components/SegmentTab';
import type { MainStackParamList } from '../navigation/MainStackNavigator';

export function useRecommendResultViewModel() {
  const [activeTab, setActiveTab] = useState<TabKey>('job');

  const jobs = MOCK_JOB_RECOMMENDATIONS;
  const hasData = jobs.length > 0;
  const trackRecommend = MOCK_TRACK_RECOMMEND;

  // 로드맵 상태 — API 연동 전 목업 데이터로 초기화
  const [roadmap, setRoadmap] = useState<RoadmapPayload | null>(MOCK_ROADMAP);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapError, setRoadmapError] = useState(false);

  const handleSelectJob = (navigation: NavigationProp<MainStackParamList>, id: string) => {
    navigation.navigate('JobDetail', { jobId: id });
  };

  /** 로드맵 데이터 재시도 — API 연동 시 실제 fetch로 교체 */
  const retryRoadmap = () => {
    setRoadmapError(false);
    setRoadmapLoading(true);
    // mock: 즉시 성공 시뮬레이션
    setTimeout(() => {
      setRoadmap(MOCK_ROADMAP);
      setRoadmapLoading(false);
    }, 800);
  };

  return {
    activeTab,
    setActiveTab,
    handleSelectJob,
    jobs,
    hasData,
    trackRecommend,
    roadmap,
    roadmapLoading,
    roadmapError,
    retryRoadmap,
  };
}
