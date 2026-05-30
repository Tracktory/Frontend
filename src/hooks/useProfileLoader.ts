import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { useAuthStore } from '../stores/authStore';
import { useProfileStore } from '../stores/profileStore';
import type { RootStackParamList } from '../navigation/RootNavigator';

export function useProfileLoader() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const loadProfile = useProfileStore((s) => s.loadProfile);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (accessToken) {
      loadProfile(accessToken, navigation);
    }
  }, [accessToken, loadProfile, navigation]);
}
