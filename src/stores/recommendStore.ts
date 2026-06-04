import type { create as CreateType } from 'zustand';

import type { RecommendResult } from '../api/recommendApi';

declare const require: (id: string) => unknown;

const { create } = require('zustand') as { create: typeof CreateType };

interface RecommendState {
  result: RecommendResult | null;
  setRecommendResult: (r: RecommendResult) => void;
  clearRecommendResult: () => void;
}

export const useRecommendStore = create<RecommendState>()((set) => ({
  result: null,
  setRecommendResult: (r) => set({ result: r }),
  clearRecommendResult: () => set({ result: null }),
}));
