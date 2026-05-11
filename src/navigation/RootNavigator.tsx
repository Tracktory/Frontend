import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { OnboardingNavigator } from './OnboardingNavigator';
import { MainTabNavigator } from './MainTabNavigator';

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
      </Stack.Navigator>
    </View>
  );
}
