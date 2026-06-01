import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { fetchRecommendResult } from '../api/recommendApi';
import type { RecommendResult } from '../api/recommendApi';
import { AuthApiError } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useRecommendStore } from '../stores/recommendStore';
import type { TabKey } from '../pages/recommendation/components/SegmentTab';
import type { MainStackParamList } from '../navigation/MainStackNavigator';
import type { RootStackParamList } from '../navigation/RootNavigator';

export function useRecommendResultViewModel() {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [activeTab, setActiveTab] = useState<TabKey>('job');

  const [result, setResult] = useState<RecommendResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const accessToken = useAuthStore((s) => s.accessToken);
  const setRecommendResult = useRecommendStore((s) => s.setRecommendResult);

  // onboardingStore 구독 — 변경 감지용
  const interests = useOnboardingStore((s) => s.interests);
  const developmentFields = useOnboardingStore((s) => s.developmentFields);
  const preferredCompanyTypes = useOnboardingStore((s) => s.preferredCompanyTypes);
  const employmentValues = useOnboardingStore((s) => s.employmentValues);

  const refresh = useCallback(async () => {
    if (!accessToken) {
      rootNavigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
      return;
    }
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await fetchRecommendResult(accessToken);
      setResult(data);
      setRecommendResult(data);
    } catch (err) {
      if (err instanceof AuthApiError) {
        switch (err.code) {
          case 'AUTH_REQUIRED':
            rootNavigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
            break;
          case 'RESOURCE_NOT_FOUND':
            rootNavigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
            break;
          default:
            setIsError(true);
        }
      } else {
        setIsError(true);
      }
    } finally {
      setIsLoading(false);
    }
  // rootNavigation은 stable ref이므로 deps 생략해도 안전하나 exhaustive-deps 준수
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

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
