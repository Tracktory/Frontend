import type { JourneySheetKey } from '../../../hooks/useRecommendResultViewModel';
import { CLIMB_VIEWBOX } from './homeMountainPaths';

export const JOURNEY_NODE_LAYOUT: {
  key: JourneySheetKey;
  label: string;
  /** 등반형 viewBox(375×740) 기준 앵커 */
  x: number;
  y: number;
  icon: string;
  nodeColor: string;
  isFlag?: boolean;
}[] = [
  {
    key: 'competency',
    label: '최종 역량',
    x: 187,
    y: 155,
    icon: 'flag',
    nodeColor: '#EF4444',
    isFlag: true,
  },
  {
    key: 'job',
    label: '직무 매칭',
    x: 182,
    y: 245,
    icon: 'compass',
    nodeColor: '#0F766E',
  },
  {
    key: 'current',
    label: '현재 위치',
    x: 192,
    y: 330,
    icon: 'person',
    nodeColor: '#14B8A6',
  },
  {
    key: 'roadmap',
    label: '학습 로드맵',
    x: 192,
    y: 420,
    icon: 'book',
    nodeColor: '#14B8A6',
  },
  {
    key: 'trackSynergy',
    label: '트랙 시너지',
    x: 168,
    y: 508,
    icon: 'git-network',
    nodeColor: '#14B8A6',
  },
];

export const JOURNEY_VIEWBOX = CLIMB_VIEWBOX;

export const SHEET_TITLES: Record<NonNullable<JourneySheetKey>, string> = {
  competency: '최종 역량 커버리지',
  job: '직무 매칭',
  current: '현재 학습 현황',
  roadmap: '학습 로드맵',
  trackSynergy: '트랙 시너지',
};
