import type { StackNavigationProp } from '@react-navigation/stack';

import type { RootStackParamList } from '../navigation/RootNavigator';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useProfileStore } from '../stores/profileStore';
import { useRecommendStore } from '../stores/recommendStore';

const ROOT_ROUTE_NAMES = new Set(['Auth', 'Onboarding', 'Main']);

export type LogoutNavigation = {
  getState: () => { routeNames: string[] } | undefined;
  getParent: () => LogoutNavigation | undefined;
  reset: StackNavigationProp<RootStackParamList>['reset'];
};

/** Tab/MainStack 등 중첩 화면에서 Root Stack navigator를 찾습니다. */
export function getRootStackNavigation(
  navigation: LogoutNavigation
): StackNavigationProp<RootStackParamList> | undefined {
  let current: LogoutNavigation | undefined = navigation;

  while (current) {
    const state = current.getState();
    if (!state) {
      current = current.getParent();
      continue;
    }
    const names = state.routeNames;
    if (names.some((name) => ROOT_ROUTE_NAMES.has(name))) {
      return current as StackNavigationProp<RootStackParamList>;
    }
    current = current.getParent();
  }

  return undefined;
}

export function performLogout(navigation: LogoutNavigation): void {
  useAuthStore.getState().clearAuth();
  useProfileStore.getState().clearProfile();
  useOnboardingStore.getState().resetOnboarding();
  useRecommendStore.getState().clearRecommendResult();
  useChatStore.getState().clearChatForLogout();

  const rootNavigation = getRootStackNavigation(navigation);
  if (!rootNavigation) {
    if (__DEV__) {
      console.warn('[performLogout] Root navigator not found — stores cleared only');
    }
    return;
  }

  rootNavigation.reset({
    index: 0,
    routes: [{ name: 'Auth' }],
  });
}
