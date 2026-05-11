import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { colors } from '../../styles/colors';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { useMyPageViewModel } from '../../hooks/useMyPageViewModel';
import { MyProfileSection } from './components/MyProfileSection';
import { MyOnboardingInfoCard } from './components/MyOnboardingInfoCard';
import { MyCompletedCoursesSection } from './components/MyCompletedCoursesSection';
import { MyRecommendationHistoryCard } from './components/MyRecommendationHistoryCard';
import { MyRedoOnboardingLink } from './components/MyRedoOnboardingLink';

export function MyPage() {
  const vm = useMyPageViewModel();
  const navigation = useNavigation();

  const handleRedoOnboarding = () => {
    const rootNav = navigation.getParent<StackNavigationProp<RootStackParamList>>();
    rootNav?.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <MyProfileSection
          displayName={vm.displayName}
          profileInitial={vm.profileInitial}
          majorLine={vm.majorLine}
          admissionBadge={vm.admissionBadge}
        />

        <MyOnboardingInfoCard
          interestsLine={vm.interestsLine}
          developmentLine={vm.developmentLine}
          employmentLine={vm.employmentLine}
          onEditInterests={() => vm.handleEditSection('interests')}
          onEditDevelopment={() => vm.handleEditSection('development')}
          onEditEmployment={() => vm.handleEditSection('employment')}
        />

        <MyCompletedCoursesSection
          courses={vm.completedCourses}
          catalog={vm.courseCatalog}
          onAddCourse={vm.addCompletedCourse}
          onRemoveCourse={vm.removeCompletedCourse}
        />

        <MyRecommendationHistoryCard
          items={vm.recommendationHistory}
          onItemPress={vm.handleHistoryPress}
        />

        <MyRedoOnboardingLink onPress={handleRedoOnboarding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
});
