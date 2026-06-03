import React, { useMemo, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../styles/colors';
import { useRecommendResultViewModel } from '../../hooks/useRecommendResultViewModel';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useProfileStore } from '../../stores/profileStore';
import { useAuthStore } from '../../stores/authStore';
import { JourneyHeader } from './components/JourneyHeader';
import { JourneyMountainBackground } from './components/JourneyMountainBackground';
import { JourneyPathNodes } from './components/JourneyPathNodes';
import { GlanceCard } from './components/GlanceCard';
import { JourneyBottomSheet } from './components/JourneyBottomSheet';
import { computeCompetencyFromRoadmap } from './utils/journeyCompetency';
import { computeJourneyMode } from './utils/journeyMode';
import { FirstYearHero } from './components/exploration/FirstYearHero';
import { JourneyCourseRegisterSheet } from './components/sheets/JourneyCourseRegisterSheet';
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

export function RecommendResultPage() {
  const insets = useSafeAreaInsets();
  const tabBarClearance = getBottomTabBarClearance(insets);
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

  const [mapSize, setMapSize] = useState({ width: 0, height: 320 });
  const [chatVisible, setChatVisible] = useState(false);
  const [briefingVisible, setBriefingVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);

  const onMapLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setMapSize({ width, height });
    }
  };

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
            roadmap={vm.roadmap}
            isError={vm.isError}
            onRetry={vm.refresh}
          />
        );
      case 'trackSynergy':
        return (
          <JourneyTrackSynergySheet data={vm.trackRecommend} />
        );
      case 'register':
        return (
          <JourneyCourseRegisterSheet
            onComplete={() => {
              vm.closeSheet();
              vm.refresh();
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={[styles.screen, { paddingBottom: tabBarClearance }]}>
        <JourneyHeader
          displayName={displayName}
          profileInitial={profileInitial}
          onBriefingPress={() => setBriefingVisible(true)}
        />

        {vm.isError ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={colors.textHint} />
            <Text style={styles.errorText}>추천 결과를 불러오지 못했습니다</Text>
            <Pressable style={styles.retryButton} onPress={vm.refresh}>
              <Text style={styles.retryButtonText}>재시도</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.mapArea} onLayout={onMapLayout}>
              {mapSize.width > 0 ? (
                <JourneyMountainBackground
                  width={mapSize.width}
                  height={mapSize.height}
                  showFullMountainBackground={showFullMountainBackground}
                />
              ) : null}
              {isExploring ? (
                <FirstYearHero
                  jobs={vm.jobs}
                  onOpenTrack={() => vm.openSheet('trackSynergy')}
                  onOpenRegister={() => vm.openSheet('register')}
                />
              ) : (
                <JourneyPathNodes
                  mapWidth={mapSize.width}
                  mapHeight={mapSize.height}
                  alignToTrail={showFullMountainBackground}
                  activeSheet={vm.activeSheet}
                  onOpenSheet={vm.openSheet}
                />
              )}
            </View>

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
          </>
        )}

        <JourneyBottomSheet
          visible={vm.activeSheet != null}
          sheetKey={vm.activeSheet}
          onClose={vm.closeSheet}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0FDFA',
  },
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    overflow: 'visible',
  },
  mapArea: {
    flex: 1,
    minHeight: 280,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0FDFA',
    paddingBottom: 88,
  },
  glanceWrap: {
    position: 'absolute',
    left: 4,
    right: 4,
    zIndex: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
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
