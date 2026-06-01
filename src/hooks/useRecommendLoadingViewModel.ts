import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { fetchRecommendResult } from '../api/recommendApi';
import { AuthApiError } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { useRecommendStore } from '../stores/recommendStore';
import type { MainStackParamList } from '../navigation/MainStackNavigator';
import type { RootStackParamList } from '../navigation/RootNavigator';

type RecommendLoadingRoute = RouteProp<MainStackParamList, 'RecommendLoading'>;

export function useRecommendLoadingViewModel() {
  const route = useRoute<RecommendLoadingRoute>();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const rootNavigation =
    navigation.getParent<StackNavigationProp<RootStackParamList>>();

  const accessToken = useAuthStore((s) => s.accessToken);
  const setRecommendResult = useRecommendStore((s) => s.setRecommendResult);

  const forceRefresh = route.params?.forceRefresh ?? true;

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isFetching = useRef(false);

  const fetchRecommend = useCallback(async () => {
    if (isFetching.current) return;
    if (!accessToken) {
      rootNavigation?.reset({ index: 0, routes: [{ name: 'Auth' }] });
      return;
    }

    isFetching.current = true;
    setIsError(false);
    setErrorMessage('');

    try {
      const data = await fetchRecommendResult(accessToken, forceRefresh);
      setRecommendResult(data);
      navigation.replace('Tabs');
    } catch (err) {
      if (err instanceof AuthApiError) {
        switch (err.code) {
          case 'AUTH_REQUIRED':
            rootNavigation?.reset({ index: 0, routes: [{ name: 'Auth' }] });
            return;
          case 'RESOURCE_NOT_FOUND':
            rootNavigation?.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
            return;
          default:
            setErrorMessage(err.message);
            setIsError(true);
        }
      } else {
        setErrorMessage('추천 결과를 불러오지 못했습니다.');
        setIsError(true);
      }
    } finally {
      isFetching.current = false;
    }
  }, [
    accessToken,
    forceRefresh,
    navigation,
    rootNavigation,
    setRecommendResult,
  ]);

  useEffect(() => {
    fetchRecommend();
  }, [fetchRecommend]);

  const handleRetry = () => {
    fetchRecommend();
  };

  return {
    isError,
    errorMessage,
    handleRetry,
  };
}
