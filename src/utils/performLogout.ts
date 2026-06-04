import type { StackNavigationProp } from '@react-navigation/stack';

import type { RootStackParamList } from '../navigation/RootNavigator';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useProfileStore } from '../stores/profileStore';
import { useRecommendStore } from '../stores/recommendStore';

export function performLogout(
  navigation: StackNavigationProp<RootStackParamList>
): void {
  useAuthStore.getState().clearAuth();
  useProfileStore.getState().clearProfile();
  useOnboardingStore.getState().resetOnboarding();
  useRecommendStore.getState().clearRecommendResult();
  useChatStore.getState().clearChatForLogout();

  navigation.reset({
    index: 0,
    routes: [{ name: 'Auth' }],
  });
}
