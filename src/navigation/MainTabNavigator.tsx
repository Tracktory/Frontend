import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';

import { RecommendResultPage } from '../pages/recommendation/RecommendResultPage';
import type { MainStackParamList } from './MainStackNavigator';
import { ChatBotPage } from '../pages/chat/ChatBotPage';
import { MyPage } from '../pages/mypage/MyPage';
import { colors } from '../styles/colors';

import HomeIcon from '../assets/images/Home.svg';
import HomeActiveIcon from '../assets/images/Home_Active.svg';
import ChatIcon from '../assets/images/Chat.svg';
import ChatActiveIcon from '../assets/images/Chat_active.svg';
import MyPageIcon from '../assets/images/MyPage.svg';
import MyPageActiveIcon from '../assets/images/MyPage_active.svg';

export type MainTabParamList = {
  Home: undefined;
  ChatBot: undefined;
  MyPage: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textHint,
      }}
    >
      <Tab.Screen
        name="Home"
        component={RecommendResultPage}
        listeners={({ navigation }) => ({
          tabPress: () => {
            const parent =
              navigation.getParent<StackNavigationProp<MainStackParamList>>();
            parent?.navigate('RecommendLoading', { forceRefresh: true });
          },
        })}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ focused }) =>
            focused
              ? <HomeActiveIcon width={24} height={24} />
              : <HomeIcon width={24} height={24} />,
        }}
      />
      <Tab.Screen
        name="ChatBot"
        component={ChatBotPage}
        options={{
          tabBarLabel: '챗봇',
          tabBarIcon: ({ focused }) =>
            focused
              ? <ChatActiveIcon width={24} height={24} />
              : <ChatIcon width={24} height={24} />,
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPage}
        options={{
          tabBarLabel: '마이',
          tabBarIcon: ({ focused }) =>
            focused
              ? <MyPageActiveIcon width={24} height={24} />
              : <MyPageIcon width={24} height={24} />,
        }}
      />
    </Tab.Navigator>
  );
}
