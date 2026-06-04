import type { NavigationProp } from '@react-navigation/native';

import type { RootStackParamList } from '../navigation/RootNavigator';

export function resetToMainTabs(rootNavigation: NavigationProp<RootStackParamList>) {
  rootNavigation.reset({
    index: 0,
    routes: [
      {
        name: 'Main',
        state: {
          routes: [{ name: 'Tabs' }],
        },
      },
    ],
  });
}
