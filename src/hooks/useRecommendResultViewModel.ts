import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useRecommendStore } from '../stores/recommendStore';
import type { MainStackParamList } from '../navigation/MainStackNavigator';
import { navigateToRecommendLoading } from '../utils/navigateToRecommendLoading';

export type JourneySheetKey =
  | 'competency'
  | 'job'
  | 'current'
  | 'roadmap'
  | 'trackSynergy'
  | 'register'
  | null;

export function useRecommendResultViewModel() {
  const navigation = useNavigation();
  const [activeSheet, setActiveSheet] = useState<JourneySheetKey>(null);

  const result = useRecommendStore((s) => s.result);

  const goToRecommendLoading = useCallback(() => {
    navigateToRecommendLoading(navigation);
  }, [navigation]);

  const hasCheckedCache = useRef(false);
  useEffect(() => {
    if (hasCheckedCache.current) return;
    hasCheckedCache.current = true;
    if (!result) {
      goToRecommendLoading();
    }
  }, [result, goToRecommendLoading]);

  const openSheet = useCallback((key: NonNullable<JourneySheetKey>) => {
    setActiveSheet(key);
  }, []);

  const closeSheet = useCallback(() => {
    setActiveSheet(null);
  }, []);

  const jobs = result?.jobs ?? [];
  const trackRecommend = result?.trackRecommend ?? null;
  const roadmap = result?.roadmap ?? null;

  const hasJobData = jobs.length > 0;
  const hasTrackData = (trackRecommend?.primary.length ?? 0) > 0;
  const hasRoadmapData = (roadmap?.semesterSteps.length ?? 0) > 0;
  const hasData = hasJobData || hasTrackData || hasRoadmapData;

  const handleSelectJob = (nav: NavigationProp<MainStackParamList>, id: string) => {
    nav.navigate('JobDetail', { jobId: id });
  };

  return {
    activeSheet,
    openSheet,
    closeSheet,
    handleSelectJob,
    jobs,
    hasData,
    hasJobData,
    hasTrackData,
    hasRoadmapData,
    trackRecommend,
    roadmap,
    isLoading: false,
    isError: false,
    refresh: goToRecommendLoading,
  };
}
