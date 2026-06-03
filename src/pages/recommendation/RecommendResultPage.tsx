import React, { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../styles/colors';
import { useRecommendResultViewModel } from '../../hooks/useRecommendResultViewModel';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useProfileStore } from '../../stores/profileStore';
import { useAuthStore } from '../../stores/authStore';
import type { MainTabParamList } from '../../navigation/MainTabNavigator';
import { JourneyHeader } from './components/JourneyHeader';
import { JourneyMountainBackground } from './components/JourneyMountainBackground';
import { JourneyPathNodes } from './components/JourneyPathNodes';
import { GlanceCard } from './components/GlanceCard';
import { JourneyBottomSheet } from './components/JourneyBottomSheet';
import { computeCompetencyFromRoadmap } from './utils/journeyCompetency';
import { computeJourneyMode } from './utils/journeyMode';
import { FirstYearHero } from './components/exploration/FirstYearHero';
import { JourneyAnalysisReportOverlay } from './components/analysisReport/JourneyAnalysisReportOverlay';
import { JourneyCompetencySheet } from './components/sheets/JourneyCompetencySheet';
import { JourneyAIBriefingBottomSheet } from './components/briefing/JourneyAIBriefingBottomSheet';
import { JourneyAIBriefingSheet } from './components/sheets/JourneyAIBriefingSheet';
import { JourneyJobMatchingSheet } from './components/sheets/JourneyJobMatchingSheet';
import { JourneyCurrentStatusSheet } from './components/sheets/JourneyCurrentStatusSheet';
import { JourneyRoadmapSheet } from './components/sheets/JourneyRoadmapSheet';
import { JourneyTrackSynergySheet } from './components/sheets/JourneyTrackSynergySheet';
import { ChatFab } from '../../components/ChatFab';
import { ChatOverlayModal } from '../../components/chat/ChatOverlayModal';
import { getBottomTabBarClearance } from '../../navigation/layout/tabBarLayout';

const GLANCE_CARD_GAP = 15;
/** Approx. GlanceCard height (2-row climbing layout). */
const GLANCE_CARD_HEIGHT_CLIMBING = 88;
const GLANCE_CARD_HEIGHT_EXPLORING = 56;
const CHAT_FAB_ABOVE_GLANCE = 16;
const HOME_BG = '#F0FDFA';

export function RecommendResultPage() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const tabBarClearance = getBottomTabBarClearance(insets);
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const vm = useRecommendResultViewModel();
  const completedCourses = useOnboardingStore((s) => s.completedCourses);
  const grade = useOnboardingStore((s) => s.grade);
  const track1 = useOnboardingStore((s) => s.track1);
  const track2 = useOnboardingStore((s) => s.track2);
  const profile = useProfileStore((s) => s.profile);
  const userName = useAuthStore((s) => s.userName);

  const profileCurrentYear = profile?.profile.currentYear;
  const displayName = profile?.profile.name ?? userName ?? '';
  const studentId = profile?.profile.studentId;
  const profileInitial = displayName ? displayName.charAt(0) : '?';

  const studentYear = profileCurrentYear ?? grade ?? 1;
  const hasSelectedTrack = Boolean(track1?.trim());
  const { isExploring, showFullMountainBackground } = computeJourneyMode({
    studentYear,
    hasSelectedTrack,
  });
  const glanceCardHeight = isExploring
    ? GLANCE_CARD_HEIGHT_EXPLORING
    : GLANCE_CARD_HEIGHT_CLIMBING;

  const competencyPercent = useMemo(
    () => computeCompetencyFromRoadmap(vm.roadmap, completedCourses).currentPercent,
    [vm.roadmap, completedCourses]
  );

  const targetJob = vm.jobs[0]?.title ?? '직무 미정';
  const jobCandidateCount = vm.jobs.length;

  const [chatVisible, setChatVisible] = useState(false);
  const [briefingVisible, setBriefingVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);

  const handleCloseSheet = () => {
    vm.closeSheet();
  };

  const goToMyPageCompletedCourses = useCallback(() => {
    vm.closeSheet();
    navigation.navigate('MyPage', { openCompletedCoursesEditor: true });
  }, [navigation, vm]);

  const isMapInteractive =
    vm.activeSheet == null && !briefingVisible && !reportVisible && !chatVisible;

  const renderSheetContent = () => {
    switch (vm.activeSheet) {
      case 'competency':
        return (
          <JourneyCompetencySheet
            roadmap={vm.roadmap}
            completedCourses={completedCourses}
            onShowReport={() => {
              vm.closeSheet();
              setReportVisible(true);
            }}
          />
        );
      case 'job':
        return (
          <JourneyJobMatchingSheet
            jobs={vm.jobs}
            hasJobData={vm.hasJobData}
            onShowBriefing={() => {
              vm.closeSheet();
              setBriefingVisible(true);
            }}
          />
        );
      case 'current':
        return (
          <JourneyCurrentStatusSheet
            roadmap={vm.roadmap}
            completedCourses={completedCourses}
            grade={grade}
            profileCurrentYear={profileCurrentYear}
            track1={track1}
            track2={track2}
          />
        );
      case 'roadmap':
        return (
          <JourneyRoadmapSheet
            track1={track1}
            track2={track2}
            targetJob={targetJob}
            studentYear={studentYear}
            completedCourses={completedCourses}
            roadmap={vm.roadmap}
            onRegister={goToMyPageCompletedCourses}
          />
        );
      case 'trackSynergy':
        return (
          <JourneyTrackSynergySheet data={vm.trackRecommend} />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.root}>
      {!vm.isError ? (
        <>
          <View
            style={[
              styles.backgroundShell,
              { width: windowWidth, height: windowHeight },
            ]}
            pointerEvents="none"
          >
            <JourneyMountainBackground
              showFullMountainBackground={showFullMountainBackground}
            />
          </View>

          <View
            style={[styles.mapLayer, { width: windowWidth, height: windowHeight }]}
            pointerEvents={isMapInteractive ? 'box-none' : 'none'}
          >
            {isExploring ? (
              <FirstYearHero
                jobs={vm.jobs}
                onOpenTrack={() => vm.openSheet('trackSynergy')}
                onOpenRegister={goToMyPageCompletedCourses}
              />
            ) : (
              <JourneyPathNodes
                mapWidth={windowWidth}
                mapHeight={windowHeight}
                alignToTrail={showFullMountainBackground}
                activeSheet={vm.activeSheet}
                onOpenSheet={vm.openSheet}
              />
            )}
          </View>
        </>
      ) : null}

      <SafeAreaView style={styles.safeArea} edges={['top']} pointerEvents="box-none">
        <View style={styles.content} pointerEvents="box-none">
          <View style={styles.headerWrap}>
            <JourneyHeader
              displayName={displayName}
              profileInitial={profileInitial}
              onBriefingPress={() => setBriefingVisible(true)}
            />
          </View>

          {vm.isError ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color={colors.textHint} />
              <Text style={styles.errorText}>추천 결과를 불러오지 못했습니다</Text>
              <Pressable style={styles.retryButton} onPress={vm.refresh}>
                <Text style={styles.retryButtonText}>재시도</Text>
              </Pressable>
            </View>
          ) : (
            <View
              style={[styles.glanceWrap, { bottom: tabBarClearance + GLANCE_CARD_GAP }]}
              pointerEvents="box-none"
            >
              <GlanceCard
                isExploring={isExploring}
                targetJob={targetJob}
                competencyPercent={competencyPercent}
                jobCandidateCount={jobCandidateCount}
                onPress={() =>
                  vm.openSheet(isExploring ? 'job' : 'competency')
                }
              />
            </View>
          )}
        </View>
      </SafeAreaView>

      <JourneyBottomSheet
        visible={vm.activeSheet != null}
        sheetKey={vm.activeSheet}
        onClose={handleCloseSheet}
      >
        {renderSheetContent()}
      </JourneyBottomSheet>

      <JourneyAIBriefingBottomSheet
        visible={briefingVisible}
        onClose={() => setBriefingVisible(false)}
      >
        <JourneyAIBriefingSheet
          isFirstYear={isExploring}
          enabled={briefingVisible}
        />
      </JourneyAIBriefingBottomSheet>

      {vm.activeSheet == null && !briefingVisible ? (
        <ChatFab
          onPress={() => setChatVisible(true)}
          bottomOffset={
            tabBarClearance +
            GLANCE_CARD_GAP +
            glanceCardHeight +
            CHAT_FAB_ABOVE_GLANCE
          }
        />
      ) : null}

      <ChatOverlayModal visible={chatVisible} onClose={() => setChatVisible(false)} />

      <JourneyAnalysisReportOverlay
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        onOpenChat={() => {
          setReportVisible(false);
          setChatVisible(true);
        }}
        roadmap={vm.roadmap}
        completedCourses={completedCourses}
        jobs={vm.jobs}
        trackRecommend={vm.trackRecommend}
        displayName={displayName}
        studentId={studentId}
        studentYear={studentYear}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: HOME_BG,
    overflow: 'hidden',
  },
  backgroundShell: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  content: {
    flex: 1,
  },
  mapLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5,
  },
  headerWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 2,
  },
  glanceWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 10,
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    zIndex: 3,
  },
  errorText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  retryButton: {
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 28,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});
