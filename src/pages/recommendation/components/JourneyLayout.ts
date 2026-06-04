import type { JourneySheetKey } from '../../../hooks/useRecommendResultViewModel';
import { CLIMB_VIEWBOX } from './homeMountainPaths';

/** 직무 매칭(#0F766E) · 학습 로드맵(#14B8A6) 사이 톤 — 현재 위치 노드 */
export const JOURNEY_NODE_JOB_COLOR = '#0F766E';
export const JOURNEY_NODE_ROADMAP_COLOR = '#14B8A6';
export const JOURNEY_NODE_CURRENT_COLOR = '#12978A';

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
    x: 177,
    y: 245,
    icon: 'compass',
    nodeColor: JOURNEY_NODE_JOB_COLOR,
  },
  {
    key: 'current',
    label: '현재 위치',
    x: 220,
    y: 330,
    icon: 'person',
    nodeColor: JOURNEY_NODE_CURRENT_COLOR,
  },
  {
    key: 'roadmap',
    label: '학습 로드맵',
    x: 192,
    y: 425,
    icon: 'library',
    nodeColor: JOURNEY_NODE_ROADMAP_COLOR,
  },
  {
    key: 'trackSynergy',
    label: '트랙 시너지',
    x: 130,
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
