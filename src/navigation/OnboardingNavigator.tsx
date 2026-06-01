import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { NamePage } from '@/src/pages/onboarding/NamePage';
import { AdmissionYearPage } from '@/src/pages/onboarding/AdmissionYearPage';
import { AffiliationPage } from '@/src/pages/onboarding/AffiliationPage';
import { CollegeSelectPage } from '@/src/pages/onboarding/CollegeSelectPage';
import { DevelopmentFieldSelectPage } from '@/src/pages/onboarding/DevelopmentFieldSelectPage';
import { EmploymentPreferencePage } from '@/src/pages/onboarding/EmploymentPreferencePage';
import { ExperiencedFieldPage } from '@/src/pages/onboarding/ExperiencedFieldPage';
import { InterestSelectPage } from '@/src/pages/onboarding/InterestSelectPage';
import { OnboardingConfirmPage } from '@/src/pages/onboarding/OnboardingConfirmPage';
import { TrackInputPage } from '@/src/pages/onboarding/TrackInputPage';

export type OnboardingStackParamList = {
  Name: undefined;
  AdmissionYear: undefined;
  Affiliation: undefined;
  CollegeSelect: undefined;
  TrackInput: undefined;
  InterestSelect: undefined;
  DevelopmentFieldSelect: undefined;
  EmploymentPreference: undefined;
  GoalSelect: undefined;
  OnboardingConfirm: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Name"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Name" component={NamePage} />
      <Stack.Screen name="AdmissionYear" component={AdmissionYearPage} />
      <Stack.Screen name="Affiliation" component={AffiliationPage} />
      <Stack.Screen name="CollegeSelect" component={CollegeSelectPage} />
      <Stack.Screen name="TrackInput" component={TrackInputPage} />
      <Stack.Screen name="InterestSelect" component={InterestSelectPage} />
      <Stack.Screen name="DevelopmentFieldSelect" component={DevelopmentFieldSelectPage} />
      <Stack.Screen name="EmploymentPreference" component={EmploymentPreferencePage} />
      <Stack.Screen name="GoalSelect" component={ExperiencedFieldPage} />
      <Stack.Screen name="OnboardingConfirm" component={OnboardingConfirmPage} />
    </Stack.Navigator>
  );
}
