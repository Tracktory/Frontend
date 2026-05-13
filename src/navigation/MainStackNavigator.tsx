import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { MainTabNavigator } from './MainTabNavigator';
import { JobDetailPage } from '../pages/recommendation/JobDetailPage';
import { CourseDetailPage } from '../pages/recommendation/CourseDetailPage';

export type MainStackParamList = {
  Tabs: undefined;
  JobDetail: { jobId: string };
  CourseDetail: { courseId: string };
};

const Stack = createStackNavigator<MainStackParamList>();

export function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabNavigator} />
      <Stack.Screen name="JobDetail" component={JobDetailPage} />
      <Stack.Screen name="CourseDetail" component={CourseDetailPage} />
    </Stack.Navigator>
  );
}
