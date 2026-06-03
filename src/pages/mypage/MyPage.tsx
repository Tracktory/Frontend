import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMyPageViewModel } from '../../hooks/useMyPageViewModel';
import { getBottomTabBarClearance } from '../../navigation/layout/tabBarLayout';
import { MyPageHeader } from './components/MyPageHeader';
import { MyProfileHeroCard } from './components/MyProfileHeroCard';
import { MyOnboardingParamsCard } from './components/MyOnboardingParamsCard';
import { MyInterestChipsSection } from './components/MyInterestChipsSection';
import { MyCompletedCoursesEditableSection } from './components/MyCompletedCoursesEditableSection';
import { MySettingsSection } from './components/MySettingsSection';
import {
  MyInfoEditModal,
  type EditableSection,
} from './components/MyInfoEditModal';

const MYPAGE_BG = '#F0FDFA';

export function MyPage() {
  const insets = useSafeAreaInsets();
  const vm = useMyPageViewModel();
  const [editingSection, setEditingSection] = React.useState<EditableSection | null>(null);
  const tabBarClearance = getBottomTabBarClearance(insets);

  const tracksOrAffiliationLabel = vm.isExploring ? '소속' : '선택 트랙';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarClearance + 20 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <MyPageHeader />

        <MyProfileHeroCard
          deptLine={vm.deptLineForHero}
          displayName={vm.displayName}
          metaLine={vm.heroMetaLine}
          miniStatPrimaryLabel={vm.miniStatPrimaryLabel}
          miniStatPrimaryValue={vm.miniStatPrimaryValue}
          miniStatPrimaryUnit={vm.miniStatPrimaryUnit}
          completedCount={vm.completedCount}
          miniStatCompetencyValue={vm.miniStatCompetencyValue}
        />

        <MyOnboardingParamsCard
          gradeLabel={vm.gradeLabel}
          tracksOrAffiliationLabel={tracksOrAffiliationLabel}
          tracksOrAffiliationValue={vm.onboardingTracksOrAffiliationLine}
          interestsSummaryLine={vm.interestsSummaryLine}
          developmentLine={vm.developmentLine}
          experiencedLine={vm.experiencedLine}
          employmentLine={vm.employmentLine}
          onPressEditGrade={() => setEditingSection('grade')}
          onPressEditTracksOrAffiliation={() => setEditingSection('tracks')}
          onPressEditInterests={() => setEditingSection('interests')}
          onPressEditDevelopment={() => setEditingSection('development')}
          onPressEditExperience={() => setEditingSection('experience')}
          onPressEditEmployment={() => setEditingSection('employment')}
        />

        <MyInterestChipsSection interests={vm.interests} />

        <MyCompletedCoursesEditableSection
          courses={vm.completedCourses}
          catalog={vm.courseCatalog}
          isAddingCourse={vm.isAddingCourse}
          removingCourseName={vm.removingCourseName}
          onAddCourse={vm.addCompletedCourse}
          onRemoveCourse={vm.removeCompletedCourse}
        />

        <MySettingsSection />
      </ScrollView>

      <MyInfoEditModal
        visible={editingSection != null}
        section={editingSection}
        isSaving={vm.isSaving}
        currentGrade={vm.profileCurrentYear ?? 1}
        currentCollege={vm.college}
        currentTrack1={vm.track1}
        currentTrack2={vm.track2}
        currentInterests={vm.interests}
        currentDevelopmentFields={vm.developmentFields}
        currentExperiencedFields={vm.experiencedFields}
        currentPreferredCompanyTypes={vm.preferredCompanyTypes}
        currentEmploymentValues={vm.employmentValues}
        onClose={() => setEditingSection(null)}
        onSaveGrade={vm.updateGrade}
        onSaveTracks={vm.updateTracks}
        onSaveInterests={vm.updateInterests}
        onSaveDevelopmentFields={vm.updateDevelopmentFields}
        onSaveExperience={vm.updateExperience}
        onSaveEmployment={vm.updateEmployment}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: MYPAGE_BG,
  },
  scroll: {
    flex: 1,
    backgroundColor: MYPAGE_BG,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
