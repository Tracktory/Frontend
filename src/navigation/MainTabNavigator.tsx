import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { RecommendResultPage } from '../pages/recommendation/RecommendResultPage';

import { ChatBotPage } from '../pages/stub/ChatBotPage';
import { MyPage } from '../pages/mypage/MyPage';
import { colors } from '../styles/colors';

export type MainTabParamList = {
  Home: undefined;
  ChatBot: undefined;
  MyPage: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      style={{
        fontSize: 11,
        marginTop: 2,
        color: focused ? colors.primary : colors.textHint,
        fontWeight: focused ? '600' : '400',
      }}
    >
      {label}
    </Text>
  );
}

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
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ focused }) => <TabIcon label="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ChatBot"
        component={ChatBotPage}
        options={{
          tabBarLabel: '챗봇',
          tabBarIcon: ({ focused }) => <TabIcon label="💬" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPage}
        options={{
          tabBarLabel: '마이',
          tabBarIcon: ({ focused }) => <TabIcon label="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
