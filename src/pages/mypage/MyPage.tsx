import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMyPageViewModel } from '../../hooks/useMyPageViewModel';
import type { MainTabParamList } from '../../navigation/MainTabNavigator';
import { getBottomTabBarClearance } from '../../navigation/layout/tabBarLayout';
import { MyPageHeader } from './components/MyPageHeader';
import { MyProfileHeroCard } from './components/MyProfileHeroCard';
import { MyOnboardingParamsCard } from './components/MyOnboardingParamsCard';
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
  const route = useRoute<RouteProp<MainTabParamList, 'MyPage'>>();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const scrollRef = useRef<ScrollView>(null);
  const pendingScrollRef = useRef(false);
  const [editingSection, setEditingSection] = React.useState<EditableSection | null>(null);
  const [autoOpenEditor, setAutoOpenEditor] = useState(false);
  const [coursesSectionY, setCoursesSectionY] = useState(0);
  const tabBarClearance = getBottomTabBarClearance(insets);

  const tracksOrAffiliationLabel = vm.isExploring ? '소속' : '선택 트랙';

  useFocusEffect(
    useCallback(() => {
      if (route.params?.openCompletedCoursesEditor) {
        setAutoOpenEditor(true);
        pendingScrollRef.current = true;
        navigation.setParams({ openCompletedCoursesEditor: undefined });
      }
    }, [navigation, route.params?.openCompletedCoursesEditor])
  );

  const handleCoursesSectionLayout = (event: { nativeEvent: { layout: { y: number } } }) => {
    const y = event.nativeEvent.layout.y;
    setCoursesSectionY(y);
    if (pendingScrollRef.current && y > 0) {
      pendingScrollRef.current = false;
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y, animated: true });
      });
    }
  };

  React.useEffect(() => {
    if (pendingScrollRef.current && coursesSectionY > 0) {
      pendingScrollRef.current = false;
      scrollRef.current?.scrollTo({ y: coursesSectionY, animated: true });
    }
  }, [coursesSectionY, autoOpenEditor]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        ref={scrollRef}
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

        <View onLayout={handleCoursesSectionLayout}>
          <MyCompletedCoursesEditableSection
            courses={vm.completedCourses}
            catalog={vm.courseCatalog}
            isAddingCourse={vm.isAddingCourse}
            removingCourseName={vm.removingCourseName}
            autoOpenEditor={autoOpenEditor}
            onEditorOpened={() => setAutoOpenEditor(false)}
            onAddCourse={vm.addCompletedCourse}
            onRemoveCourse={vm.removeCompletedCourse}
          />
        </View>

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
