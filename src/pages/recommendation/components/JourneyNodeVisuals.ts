import type { JourneySheetKey } from '../../../hooks/useRecommendResultViewModel';

export type JourneyNodeVisualState = 'gradient' | 'ripple' | 'default';

export const JOURNEY_NODE_SIZE = 40;
export const JOURNEY_GRADIENT_START = '#14B8A6';
export const JOURNEY_GRADIENT_END = '#0D9488';
export const JOURNEY_LABEL_HIGHLIGHT_BG = '#14B8A6';
export const JOURNEY_LABEL_HIGHLIGHT_TEXT = '#FFFFFF';
export const JOURNEY_LABEL_DEFAULT_BG = 'rgba(255,255,255,0.85)';
export const JOURNEY_LABEL_DEFAULT_TEXT = '#0D9488';
export const JOURNEY_RIPPLE_COLOR = '#14B8A6';

export function resolveNodeVisualState(
  nodeKey: NonNullable<JourneySheetKey>,
  activeSheet: JourneySheetKey,
): JourneyNodeVisualState {
  if (activeSheet == null) {
    return nodeKey === 'current' ? 'gradient' : 'default';
  }
  if (activeSheet === nodeKey) return 'gradient';
  if (nodeKey === 'current') return 'ripple';
  return 'default';
}
