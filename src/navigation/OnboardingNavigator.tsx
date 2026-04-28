import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AdmissionYearPage } from '@/src/pages/onboarding/AdmissionYearPage';
import { AffiliationPage } from '@/src/pages/onboarding/AffiliationPage';
import { CollegeSelectPage } from '@/src/pages/onboarding/CollegeSelectPage';
import { DevelopmentFieldSelectPage } from '@/src/pages/onboarding/DevelopmentFieldSelectPage';
import { GoalSelectPage } from '@/src/pages/onboarding/GoalSelectPage';
import { InterestSelectPage } from '@/src/pages/onboarding/InterestSelectPage';
import { LearningMethodSelectPage } from '@/src/pages/onboarding/LearningMethodSelectPage';

export type OnboardingStackParamList = {
  AdmissionYear: undefined;
  Affiliation: undefined;
  CollegeSelect: undefined;
  InterestSelect: undefined;
  DevelopmentFieldSelect: undefined;
  LearningMethodSelect: undefined;
  GoalSelect: undefined;
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
      <Stack.Screen name="DevelopmentFieldSelect" component={DevelopmentFieldSelectPage} />
      <Stack.Screen name="LearningMethodSelect" component={LearningMethodSelectPage} />
      <Stack.Screen name="GoalSelect" component={GoalSelectPage} />
    </Stack.Navigator>
  );
}
