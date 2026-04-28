import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AdmissionYearPage } from '@/src/pages/onboarding/AdmissionYearPage';
import { AffiliationPage } from '@/src/pages/onboarding/AffiliationPage';
import { CollegeSelectPage } from '@/src/pages/onboarding/CollegeSelectPage';
import { InterestSelectPage } from '@/src/pages/onboarding/InterestSelectPage';

export type OnboardingStackParamList = {
  AdmissionYear: undefined;
  Affiliation: undefined;
  CollegeSelect: undefined;
  InterestSelect: undefined;
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
      <Stack.Screen name="CollegeSelect" component={CollegeSelectPage} />
      <Stack.Screen name="InterestSelect" component={InterestSelectPage} />
    </Stack.Navigator>
  );
}
