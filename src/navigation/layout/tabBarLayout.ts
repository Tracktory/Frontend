import type { EdgeInsets } from 'react-native-safe-area-context';

/** Matches `BottomDialTabBar` dial track + labels (78px content area). */
export const DIAL_TAB_BAR_PADDING_TOP = 8;
export const DIAL_TAB_BAR_CONTENT_HEIGHT = 78;
export const TAB_BAR_FLOATING_GAP = 12;
/** Extra breathing room for bottom sheets/modals above the dial tab bar. */
export const MODAL_BOTTOM_EXTRA_CLEARANCE = -60;

export function getBottomTabBarClearance(insets: Pick<EdgeInsets, 'bottom'>): number {
  return (
    DIAL_TAB_BAR_PADDING_TOP +
    DIAL_TAB_BAR_CONTENT_HEIGHT +
    Math.max(insets.bottom, 8) +
    TAB_BAR_FLOATING_GAP
  );
}

export function getModalBottomTabBarClearance(insets: Pick<EdgeInsets, 'bottom'>): number {
  return getBottomTabBarClearance(insets) + MODAL_BOTTOM_EXTRA_CLEARANCE;
}
