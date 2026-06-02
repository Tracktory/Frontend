import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { useOnboardingStore } from '../stores/onboardingStore';

import { NamePage } from '@/src/pages/onboarding/NamePage';
import { AdmissionYearPage } from '@/src/pages/onboarding/AdmissionYearPage';
import { AffiliationPage } from '@/src/pages/onboarding/AffiliationPage';
import { CollegeSelectPage } from '@/src/pages/onboarding/CollegeSelectPage';
import { Track1SelectPage } from '@/src/pages/onboarding/Track1SelectPage';
import { Track2SelectPage } from '@/src/pages/onboarding/Track2SelectPage';
import { DevelopmentFieldSelectPage } from '@/src/pages/onboarding/DevelopmentFieldSelectPage';
import { CompanyTypeSelectPage } from '@/src/pages/onboarding/CompanyTypeSelectPage';
import { EmploymentValueSelectPage } from '@/src/pages/onboarding/EmploymentValueSelectPage';
import { ExperiencedFieldPage } from '@/src/pages/onboarding/ExperiencedFieldPage';
import { InterestSelectPage } from '@/src/pages/onboarding/InterestSelectPage';
import { OnboardingConfirmPage } from '@/src/pages/onboarding/OnboardingConfirmPage';

export type OnboardingStackParamList = {
  Name: undefined;
  AdmissionYear: undefined;
  Affiliation: undefined;
  CollegeSelect: undefined;
  Track1Select: undefined;
  Track2Select: undefined;
  InterestSelect: undefined;
  DevelopmentFieldSelect: undefined;
  CompanyTypeSelect: undefined;
  EmploymentValueSelect: undefined;
  GoalSelect: undefined;
  OnboardingConfirm: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  const resetOnboarding = useOnboardingStore((s) => s.resetOnboarding);

  useEffect(() => {
    resetOnboarding();
  }, [resetOnboarding]);

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
      <Stack.Screen name="Track1Select" component={Track1SelectPage} />
      <Stack.Screen name="Track2Select" component={Track2SelectPage} />
      <Stack.Screen name="InterestSelect" component={InterestSelectPage} />
      <Stack.Screen name="DevelopmentFieldSelect" component={DevelopmentFieldSelectPage} />
      <Stack.Screen name="CompanyTypeSelect" component={CompanyTypeSelectPage} />
      <Stack.Screen name="EmploymentValueSelect" component={EmploymentValueSelectPage} />
      <Stack.Screen name="GoalSelect" component={ExperiencedFieldPage} />
      <Stack.Screen name="OnboardingConfirm" component={OnboardingConfirmPage} />
    </Stack.Navigator>
  );
}
