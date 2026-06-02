import type { NavigationProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { MainStackParamList } from '../navigation/MainStackNavigator';
import type { RootStackParamList } from '../navigation/RootNavigator';

type NavigationWithParent = {
  getParent<T>(): T | undefined;
};

export function resetToRecommendLoading(
  rootNavigation: NavigationProp<RootStackParamList>
) {
  rootNavigation.reset({
    index: 0,
    routes: [
      {
        name: 'Main',
        state: {
          routes: [{ name: 'RecommendLoading', params: { forceRefresh: false } }],
        },
      },
    ],
  });
}

export function navigateToRecommendLoading(navigation: NavigationWithParent) {
  const parent = navigation.getParent<StackNavigationProp<MainStackParamList>>();
  if (parent) {
    parent.navigate('RecommendLoading', { forceRefresh: false });
  }
}
