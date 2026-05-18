import { useCallback, useEffect, useRef, useState } from 'react';
import type { NavigationProp } from '@react-navigation/native';

import { fetchRecommendResult } from '../api/recommendApi';
import type { RecommendResult } from '../api/recommendApi';
import type { TabKey } from '../pages/recommendation/components/SegmentTab';
import type { MainStackParamList } from '../navigation/MainStackNavigator';
import { useOnboardingStore } from '../stores/onboardingStore';

export function useRecommendResultViewModel() {
  const [activeTab, setActiveTab] = useState<TabKey>('job');

  const [result, setResult] = useState<RecommendResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // onboardingStore 구독 — 변경 감지용
  const interests = useOnboardingStore((s) => s.interests);
  const developmentFields = useOnboardingStore((s) => s.developmentFields);
  const preferredCompanyTypes = useOnboardingStore((s) => s.preferredCompanyTypes);
  const employmentValues = useOnboardingStore((s) => s.employmentValues);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await fetchRecommendResult();
      setResult(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 최초 마운트 시 데이터 로드
  useEffect(() => {
    refresh();
  }, [refresh]);

  // onboardingStore 변경 시 재조회 (초기 마운트 제외)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    refresh();
  // refresh는 useCallback으로 안정적이므로 deps에서 제외해도 되나,
  // eslint가 요구하므로 포함 (무한루프 없음 — refresh 자체는 변하지 않음)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interests, developmentFields, preferredCompanyTypes, employmentValues]);

  const jobs = result?.jobs ?? [];
  const hasData = jobs.length > 0;
  const trackRecommend = result?.trackRecommend ?? null;
  const roadmap = result?.roadmap ?? null;

  const handleSelectJob = (navigation: NavigationProp<MainStackParamList>, id: string) => {
    navigation.navigate('JobDetail', { jobId: id });
  };

  return {
    activeTab,
    setActiveTab,
    handleSelectJob,
    jobs,
    hasData,
    trackRecommend,
    roadmap,
    isLoading,
    isError,
    refresh,
  };
}
