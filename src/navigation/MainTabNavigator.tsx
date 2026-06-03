import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { RecommendResultPage } from '../pages/recommendation/RecommendResultPage';
import { ChatBotPage } from '../pages/chat/ChatBotPage';
import { MyPage } from '../pages/mypage/MyPage';
import { BottomDialTabBar } from './components/BottomDialTabBar';

export type MainTabParamList = {
  Home: undefined;
  ChatBot: undefined;
  MyPage: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomDialTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        animation: 'shift',
        sceneStyle: { backgroundColor: '#F0FDFA' },
      }}
    >
      <Tab.Screen name="Home" component={RecommendResultPage} />
      <Tab.Screen
        name="ChatBot"
        component={ChatBotPage}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen name="MyPage" component={MyPage} />
    </Tab.Navigator>
  );
}
