import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { AuthApiError } from '../api/authApi';
import {
  fetchJobBriefings,
  type BriefingSource,
  type JobBriefing,
} from '../api/briefingApi';
import { fetchRecommendResult } from '../api/recommendApi';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useRecommendStore } from '../stores/recommendStore';

const STREAM_DELAY_MS = 380;

export type BriefingCard = {
  code: string;
  job: string;
  headline: string;
  summary: string;
  skills: string[];
  sources: BriefingSource[];
};

function mapBriefing(item: JobBriefing): BriefingCard {
  return {
    code: item.code,
    job: item.name,
    headline: item.headline,
    summary: item.summary,
    skills: item.skills ?? [],
    sources: item.sources ?? [],
  };
}

type UseAIBriefingOptions = {
  accessToken: string | null;
  enabled?: boolean;
};

export function useAIBriefing({ accessToken, enabled = true }: UseAIBriefingOptions) {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const setRecommendResult = useRecommendStore((s) => s.setRecommendResult);

  const [visibleCards, setVisibleCards] = useState<BriefingCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);

  const fetchGen = useRef(0);
  const streamGen = useRef(0);
  const retriedRecommend = useRef(false);

  const runStream = useCallback((items: BriefingCard[]) => {
    const gen = ++streamGen.current;
    setIsLoading(true);
    setIsStreaming(false);
    setVisibleCards([]);
    setIsEmpty(false);

    if (items.length === 0) {
      setIsLoading(false);
      setIsEmpty(true);
      return () => {};
    }

    const timer = setTimeout(() => {
      if (streamGen.current !== gen) return;
      setIsLoading(false);
      setIsStreaming(true);

      items.forEach((card, i) => {
        setTimeout(() => {
          if (streamGen.current !== gen) return;
          setVisibleCards((prev) => [...prev, card]);
          if (i === items.length - 1) {
            setIsStreaming(false);
          }
        }, i * STREAM_DELAY_MS);
      });
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const loadBriefings = useCallback(
    async (allowRecommendRetry: boolean) => {
      if (!accessToken) return;

      const gen = ++fetchGen.current;
      ++streamGen.current;
      setIsLoading(true);
      setIsStreaming(false);
      setVisibleCards([]);
      setErrorMessage(null);
      setIsEmpty(false);

      try {
        const briefings = await fetchJobBriefings(accessToken);
        if (gen !== fetchGen.current) return;

        retriedRecommend.current = false;
        const cards = briefings.map(mapBriefing);
        runStream(cards);
      } catch (err) {
        if (gen !== fetchGen.current) return;

        if (err instanceof AuthApiError) {
          switch (err.code) {
            case 'RECOMMENDATION_NOT_FOUND':
              if (allowRecommendRetry && !retriedRecommend.current) {
                retriedRecommend.current = true;
                try {
                  const rec = await fetchRecommendResult(accessToken, false);
                  if (gen !== fetchGen.current) return;
                  setRecommendResult(rec);
                  await loadBriefings(false);
                  return;
                } catch {
                  setErrorMessage('추천을 생성한 뒤 브리핑을 불러오지 못했어요.');
                }
                setIsLoading(false);
                return;
              }
              setErrorMessage(err.message);
              break;
            case 'AUTH_REQUIRED':
              rootNavigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
              break;
            default:
              setErrorMessage(err.message);
          }
        } else {
          setErrorMessage('브리핑을 불러오지 못했습니다.');
        }
        setIsLoading(false);
      }
    },
    [accessToken, rootNavigation, runStream, setRecommendResult]
  );

  useEffect(() => {
    if (!enabled) {
      fetchGen.current += 1;
      ++streamGen.current;
      setVisibleCards([]);
      setIsLoading(false);
      setIsStreaming(false);
      setErrorMessage(null);
      setIsEmpty(false);
      return;
    }
    if (!accessToken) return;

    retriedRecommend.current = false;
    void loadBriefings(true);
  }, [enabled, accessToken, loadBriefings]);

  const retry = useCallback(() => {
    retriedRecommend.current = false;
    void loadBriefings(true);
  }, [loadBriefings]);

  const statusText =
    isLoading || isStreaming
      ? '생성 중...'
      : visibleCards.length > 0
        ? `${visibleCards.length}개 생성됨`
        : '';

  return {
    cards: visibleCards,
    isLoading,
    isStreaming,
    errorMessage,
    isEmpty,
    retry,
    statusText,
    apiReady: true,
  };
}
