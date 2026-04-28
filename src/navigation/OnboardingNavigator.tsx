import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AdmissionYearPage } from '@/src/pages/onboarding/AdmissionYearPage';
import { AffiliationPage } from '@/src/pages/onboarding/AffiliationPage';
import { CollegeSelectPage } from '@/src/pages/onboarding/CollegeSelectPage';
import { EmploymentPreferencePage } from '@/src/pages/onboarding/EmploymentPreferencePage';
import { GoalSelectPage } from '@/src/pages/onboarding/GoalSelectPage';
import { InterestSelectPage } from '@/src/pages/onboarding/InterestSelectPage';
import { OnboardingConfirmPage } from '@/src/pages/onboarding/OnboardingConfirmPage';

export type OnboardingStackParamList = {
  AdmissionYear: undefined;
  Affiliation: undefined;
  CollegeSelect: undefined;
  InterestSelect: undefined;
  EmploymentPreference: undefined;
  GoalSelect: undefined;
  OnboardingConfirm: undefined;
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
      <Stack.Screen name="EmploymentPreference" component={EmploymentPreferencePage} />
      <Stack.Screen name="GoalSelect" component={GoalSelectPage} />
      <Stack.Screen name="OnboardingConfirm" component={OnboardingConfirmPage} />
    </Stack.Navigator>
  );
}
