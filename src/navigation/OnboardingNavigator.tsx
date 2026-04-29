import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AdmissionYearPage } from '@/src/pages/onboarding/AdmissionYearPage';
import { AffiliationPage } from '@/src/pages/onboarding/AffiliationPage';
import { CollegeSelectPage } from '@/src/pages/onboarding/CollegeSelectPage';
import { DevelopmentFieldSelectSophomorePage } from '@/src/pages/onboarding/DevelopmentFieldSelectSophomorePage';
import { EmploymentPreferenceSophomorePage } from '@/src/pages/onboarding/EmploymentPreferenceSophomorePage';
import { EmploymentPreferencePage } from '@/src/pages/onboarding/EmploymentPreferencePage';
import { ExperiencedFieldSophomorePage } from '@/src/pages/onboarding/ExperiencedFieldSophomorePage';
import { GoalSelectPage } from '@/src/pages/onboarding/GoalSelectPage';
import { InterestSelectPage } from '@/src/pages/onboarding/InterestSelectPage';
import { InterestSelectSophomorePage } from '@/src/pages/onboarding/InterestSelectSophomorePage';
import { OnboardingConfirmPage } from '@/src/pages/onboarding/OnboardingConfirmPage';
import { OnboardingConfirmSophomorePage } from '@/src/pages/onboarding/OnboardingConfirmSophomorePage';
import { TrackInputPage } from '@/src/pages/onboarding/TrackInputPage';
import { RecommendLoadingPage } from '@/src/pages/recommendation/RecommendLoadingPage';

export type OnboardingStackParamList = {
  AdmissionYear: undefined;
  Affiliation: undefined;
  CollegeSelect: undefined;
  InterestSelect: undefined;
  EmploymentPreference: undefined;
  GoalSelect: undefined;
  OnboardingConfirm: undefined;
  TrackInput: undefined;
  InterestSelectSophomore: undefined;
  DevelopmentFieldSelectSophomore: undefined;
  EmploymentPreferenceSophomore: undefined;
  ExperiencedFieldSophomore: undefined;
  OnboardingConfirmSophomore: undefined;
  RecommendLoading: undefined;
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
      <Stack.Screen name="TrackInput" component={TrackInputPage} />
      <Stack.Screen name="InterestSelectSophomore" component={InterestSelectSophomorePage} />
      <Stack.Screen
        name="DevelopmentFieldSelectSophomore"
        component={DevelopmentFieldSelectSophomorePage}
      />
      <Stack.Screen
        name="EmploymentPreferenceSophomore"
        component={EmploymentPreferenceSophomorePage}
      />
      <Stack.Screen
        name="ExperiencedFieldSophomore"
        component={ExperiencedFieldSophomorePage}
      />
      <Stack.Screen
        name="OnboardingConfirmSophomore"
        component={OnboardingConfirmSophomorePage}
      />
      <Stack.Screen name="RecommendLoading" component={RecommendLoadingPage} />
    </Stack.Navigator>
  );
}
