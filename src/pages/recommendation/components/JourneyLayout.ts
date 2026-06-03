import type { JourneySheetKey } from '../../../hooks/useRecommendResultViewModel';

export const JOURNEY_NODE_LAYOUT: {
  key: JourneySheetKey;
  label: string;
  yRatio: number;
  icon: string;
  nodeColor: string;
  isFlag?: boolean;
}[] = [
  { key: 'competency', label: '최종 역량', yRatio: 0.08, icon: 'flag', nodeColor: '#EF4444', isFlag: true },
  { key: 'job', label: '직무 매칭', yRatio: 0.28, icon: 'compass', nodeColor: '#0F766E' },
  { key: 'current', label: '현재 위치', yRatio: 0.48, icon: 'person', nodeColor: '#14B8A6' },
  { key: 'roadmap', label: '학습 로드맵', yRatio: 0.66, icon: 'book', nodeColor: '#14B8A6' },
  { key: 'trackSynergy', label: '트랙 시너지', yRatio: 0.84, icon: 'git-network', nodeColor: '#14B8A6' },
];

export const SHEET_TITLES: Record<NonNullable<JourneySheetKey>, string> = {
  competency: '최종 역량 커버리지',
  job: '직무 매칭',
  current: '현재 학습 현황',
  roadmap: '학습 로드맵',
  trackSynergy: '트랙 시너지',
};
