import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AdmissionYearPage } from '@/src/pages/onboarding/AdmissionYearPage';
import { AffiliationPage } from '@/src/pages/onboarding/AffiliationPage';

export type OnboardingStackParamList = {
  AdmissionYear: undefined;
  Affiliation: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="AdmissionYear"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AdmissionYear" component={AdmissionYearPage} />
      <Stack.Screen name="Affiliation" component={AffiliationPage} />
    </Stack.Navigator>
  );
}
