import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { MainTabNavigator } from './MainTabNavigator';
import { JobDetailPage } from '../pages/recommendation/JobDetailPage';

export type MainStackParamList = {
  Tabs: undefined;
  JobDetail: { jobId: string };
};

const Stack = createStackNavigator<MainStackParamList>();

export function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabNavigator} />
      <Stack.Screen name="JobDetail" component={JobDetailPage} />
    </Stack.Navigator>
  );
}
