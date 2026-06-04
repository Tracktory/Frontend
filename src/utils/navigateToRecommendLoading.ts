import type { NavigationProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { MainStackParamList } from '../navigation/MainStackNavigator';
import type { RootStackParamList } from '../navigation/RootNavigator';

type NavigationWithParent = {
  getParent<T>(): T | undefined;
};

export function resetToRecommendLoading(
  rootNavigation: NavigationProp<RootStackParamList>,
  forceRefresh = true
) {
  rootNavigation.reset({
    index: 0,
    routes: [
      {
        name: 'Main',
        state: {
          routes: [{ name: 'RecommendLoading', params: { forceRefresh } }],
        },
      },
    ],
  });
}

export function navigateToRecommendLoading(
  navigation: NavigationWithParent,
  forceRefresh = false
) {
  const parent = navigation.getParent<StackNavigationProp<MainStackParamList>>();
  if (parent) {
    parent.navigate('RecommendLoading', { forceRefresh });
  }
}
