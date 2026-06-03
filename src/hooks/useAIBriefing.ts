import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  BRIEFING_CARD_POOLS,
  CLIMBING_BRIEFING_POOLS,
  type BriefingItem,
} from '../pages/recommendation/data/briefingMockData';

const STREAM_DELAY_MS = 380;

type UseAIBriefingOptions = {
  isFirstYear: boolean;
  enabled?: boolean;
};

export function useAIBriefing({ isFirstYear, enabled = true }: UseAIBriefingOptions) {
  const pools = isFirstYear ? BRIEFING_CARD_POOLS : CLIMBING_BRIEFING_POOLS;
  const [poolIndex, setPoolIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState<BriefingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamGen = useRef(0);

  const fullPool = useMemo(
    () => pools[poolIndex % pools.length] ?? pools[0] ?? [],
    [pools, poolIndex],
  );

  const runStream = useCallback(
    (items: BriefingItem[]) => {
      const gen = ++streamGen.current;
      setIsLoading(true);
      setIsStreaming(false);
      setVisibleCards([]);

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
    },
    [],
  );

  useEffect(() => {
    if (!enabled) {
      setVisibleCards([]);
      setIsLoading(false);
      setIsStreaming(false);
      return;
    }
    const cleanup = runStream(fullPool);
    return cleanup;
  }, [enabled, fullPool, runStream]);

  const refresh = useCallback(() => {
    setPoolIndex((i) => i + 1);
  }, []);

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
    refresh,
    statusText,
    /** Reserved for future EXPO_PUBLIC_ANTHROPIC_API_KEY integration */
    apiReady: false,
  };
}
