import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';



import { MainTabNavigator } from './MainTabNavigator';

import { JobDetailPage } from '../pages/recommendation/JobDetailPage';

import { CourseDetailPage } from '../pages/recommendation/CourseDetailPage';

import { RecommendLoadingPage } from '../pages/recommendation/RecommendLoadingPage';

import { useProfileLoader } from '../hooks/useProfileLoader';



export type MainStackParamList = {

  RecommendLoading: { forceRefresh?: boolean } | undefined;

  Tabs: undefined;

  JobDetail: { jobId: string };

  CourseDetail: { courseId: string };

};



const Stack = createStackNavigator<MainStackParamList>();



function MainStackNavigatorInner() {

  useProfileLoader();



  return (

    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="RecommendLoading" component={RecommendLoadingPage} />

      <Stack.Screen name="Tabs" component={MainTabNavigator} />

      <Stack.Screen name="JobDetail" component={JobDetailPage} />

      <Stack.Screen name="CourseDetail" component={CourseDetailPage} />

    </Stack.Navigator>

  );

}



export function MainStackNavigator() {

  return <MainStackNavigatorInner />;

}

