import { useCallback, useEffect, useRef, useState } from 'react';

import { useNavigation, type NavigationProp } from '@react-navigation/native';

import type { StackNavigationProp } from '@react-navigation/stack';



import { useOnboardingStore } from '../stores/onboardingStore';

import { useRecommendStore } from '../stores/recommendStore';

import type { TabKey } from '../pages/recommendation/components/SegmentTab';

import type { MainStackParamList } from '../navigation/MainStackNavigator';

import { navigateToRecommendLoading } from '../utils/navigateToRecommendLoading';



export function useRecommendResultViewModel() {

  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState<TabKey>('job');



  const result = useRecommendStore((s) => s.result);



  const interests = useOnboardingStore((s) => s.interests);

  const developmentFields = useOnboardingStore((s) => s.developmentFields);

  const preferredCompanyTypes = useOnboardingStore((s) => s.preferredCompanyTypes);

  const employmentValues = useOnboardingStore((s) => s.employmentValues);



  const goToRecommendLoading = useCallback(() => {

    navigateToRecommendLoading(navigation);

  }, [navigation]);



  // store에 데이터 없으면 로딩 화면으로 (스택 우회 진입 대비)

  const hasCheckedCache = useRef(false);

  useEffect(() => {

    if (hasCheckedCache.current) return;

    hasCheckedCache.current = true;

    if (!result) {

      goToRecommendLoading();

    }

  }, [result, goToRecommendLoading]);



  // onboardingStore 변경 시 재조회 (초기 마운트 제외)

  const isFirstRender = useRef(true);

  useEffect(() => {

    if (isFirstRender.current) {

      isFirstRender.current = false;

      return;

    }

    goToRecommendLoading();

  }, [interests, developmentFields, preferredCompanyTypes, employmentValues, goToRecommendLoading]);



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

    activeTab,

    setActiveTab,

    handleSelectJob,

    jobs,

    hasData,

    hasJobData,

    trackRecommend,

    roadmap,

    isLoading: false,

    isError: false,

    refresh: goToRecommendLoading,

  };

}

