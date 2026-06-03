import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { JobRecommendation } from '../../../../data/mockRecommendData';
import { getModalBottomTabBarClearance } from '../../../../navigation/layout/tabBarLayout';
import type { RoadmapPayload } from '../../../../data/mockRoadmapData';
import type { TrackRecommendPayload } from '../../../../data/mockTrackRecommendData';
import { buildAnalysisReportModel } from '../../utils/buildAnalysisReportModel';
import { AnalysisReportFooter } from './AnalysisReportFooter';
import { AnalysisReportHeader } from './AnalysisReportHeader';
import { AIActionsSection } from './sections/AIActionsSection';
import { FinalCoveragePlanSection } from './sections/FinalCoveragePlanSection';
import { JobMatchingDetailSection } from './sections/JobMatchingDetailSection';
import { OverallCoverageSection } from './sections/OverallCoverageSection';
import { SemesterTimelineSection } from './sections/SemesterTimelineSection';
import { SkillAnalysisSection } from './sections/SkillAnalysisSection';
import { TrackCompletionSection } from './sections/TrackCompletionSection';

const SPRING_CONFIG = { damping: 30, stiffness: 300 };

interface JourneyAnalysisReportOverlayProps {
  visible: boolean;
  onClose: () => void;
  onOpenChat: () => void;
  roadmap: RoadmapPayload | null;
  completedCourses: string[];
  jobs: JobRecommendation[];
  trackRecommend: TrackRecommendPayload | null;
  displayName: string;
  studentId?: string;
  studentYear: number;
}

export function JourneyAnalysisReportOverlay({
  visible,
  onClose,
  onOpenChat,
  roadmap,
  completedCourses,
  jobs,
  trackRecommend,
  displayName,
  studentId,
  studentYear,
}: JourneyAnalysisReportOverlayProps) {
  const insets = useSafeAreaInsets();
  const tabBarClearance = getModalBottomTabBarClearance(insets);
  const { width: screenWidth } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);
  const translateX = useSharedValue(screenWidth);

  const model = useMemo(
    () =>
      buildAnalysisReportModel({
        roadmap,
        completedCourses,
        jobs,
        trackRecommend,
        displayName,
        studentId,
        studentYear,
      }),
    [
      roadmap,
      completedCourses,
      jobs,
      trackRecommend,
      displayName,
      studentId,
      studentYear,
    ],
  );

  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateX.value = screenWidth;
      translateX.value = withSpring(0, SPRING_CONFIG);
      return;
    }
    if (mounted) {
      translateX.value = withSpring(screenWidth, SPRING_CONFIG, (finished) => {
        if (finished) {
          runOnJS(setMounted)(false);
        }
      });
    }
  }, [visible, mounted, screenWidth, translateX]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const shouldShow = visible || mounted;
  if (!shouldShow) return null;

  return (
    <Modal
      visible={shouldShow}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Animated.View
          style={[
            styles.panel,
            panelStyle,
            { paddingTop: insets.top, paddingBottom: tabBarClearance },
          ]}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[0]}
          >
            <AnalysisReportHeader
              subtitle={model.subtitle}
              onBack={onClose}
              onShare={() => {}}
            />

            <View style={styles.sections}>
              <OverallCoverageSection model={model} />
              <SkillAnalysisSection skillRadar={model.skillRadar} />
              <TrackCompletionSection
                trackBars={model.trackBars}
                synergyTip={model.synergyTip}
              />
              <JobMatchingDetailSection jobs={model.jobs} />
              <SemesterTimelineSection
                semesters={model.semesters}
                defaultExpandedIndex={model.defaultExpandedSemesterIndex}
              />
              <FinalCoveragePlanSection
                currentPercent={model.currentPercent}
                targetPercent={model.targetPercent}
                remainingCount={model.remainingCount}
                skillComparison={model.skillComparison}
                remainingCoursePlan={model.remainingCoursePlan}
                prerequisiteWarning={model.prerequisiteWarning}
              />
              <AIActionsSection actions={model.aiActions} />
              <AnalysisReportFooter onOpenChat={onOpenChat} />
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  panel: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F9FAFB',
    zIndex: 50,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sections: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 20,
  },
});
