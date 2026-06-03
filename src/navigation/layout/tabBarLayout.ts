import type { EdgeInsets } from 'react-native-safe-area-context';

/** Matches `BottomDialTabBar` container + tallest tab item (icon, label, sub, dot). */
export const DIAL_TAB_BAR_PADDING_TOP = 8;
export const DIAL_TAB_BAR_CONTENT_HEIGHT = 96;
export const TAB_BAR_FLOATING_GAP = 8;

export function getBottomTabBarClearance(insets: Pick<EdgeInsets, 'bottom'>): number {
  return (
    DIAL_TAB_BAR_PADDING_TOP +
    DIAL_TAB_BAR_CONTENT_HEIGHT +
    Math.max(insets.bottom, 8) +
    TAB_BAR_FLOATING_GAP
  );
}
