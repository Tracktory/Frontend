import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../styles/colors';
import { useMyPageViewModel } from '../../hooks/useMyPageViewModel';
import { MyProfileSection } from './components/MyProfileSection';
import { MyOnboardingInfoCard } from './components/MyOnboardingInfoCard';
import { MyCompletedCoursesSection } from './components/MyCompletedCoursesSection';
import { MyRecommendationHistoryCard } from './components/MyRecommendationHistoryCard';
import { MyInfoEditModal } from './components/MyInfoEditModal';

type EditableSection = 'interests' | 'development' | 'employment';

export function MyPage() {
  const vm = useMyPageViewModel();
  const [editingSection, setEditingSection] = React.useState<EditableSection | null>(null);

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
          onEditInterests={() => setEditingSection('interests')}
          onEditDevelopment={() => setEditingSection('development')}
          onEditEmployment={() => setEditingSection('employment')}
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
        <MyInfoEditModal
          visible={editingSection != null}
          section={editingSection}
          isSaving={vm.isSaving}
          currentInterests={vm.interests}
          currentDevelopmentFields={vm.developmentFields}
          currentPreferredCompanyTypes={vm.preferredCompanyTypes}
          currentEmploymentValues={vm.employmentValues}
          onClose={() => setEditingSection(null)}
          onSaveInterests={vm.updateInterests}
          onSaveDevelopmentFields={vm.updateDevelopmentFields}
          onSaveEmployment={vm.updateEmployment}
        />
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
