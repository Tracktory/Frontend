import type { create as CreateType } from 'zustand';

import type { RecommendResult } from '../api/recommendApi';

declare const require: (id: string) => unknown;

const { create } = require('zustand') as { create: typeof CreateType };

interface RecommendState {
  result: RecommendResult | null;
  /** 마이페이지 온보딩 수정 후 홈 탭 진입 시 추천 재생성(forceRefresh) */
  shouldForceRefreshOnHomeFocus: boolean;
  setRecommendResult: (r: RecommendResult) => void;
  clearRecommendResult: () => void;
  markForceRefreshOnHomeFocus: () => void;
  clearForceRefreshOnHomeFocus: () => void;
}

export const useRecommendStore = create<RecommendState>()((set) => ({
  result: null,
  shouldForceRefreshOnHomeFocus: false,
  setRecommendResult: (r) => set({ result: r }),
  clearRecommendResult: () => set({ result: null }),
  markForceRefreshOnHomeFocus: () => set({ shouldForceRefreshOnHomeFocus: true }),
  clearForceRefreshOnHomeFocus: () => set({ shouldForceRefreshOnHomeFocus: false }),
}));
