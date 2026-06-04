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

import { useAnalysisReport } from '../../../../hooks/useAnalysisReport';
import type { AnalysisReportLocalParams } from '../../../../hooks/useAnalysisReport';
import { getModalBottomTabBarClearance } from '../../../../navigation/layout/tabBarLayout';
import { AnalysisReportFooter } from './AnalysisReportFooter';
import { AnalysisReportHeader } from './AnalysisReportHeader';
import { FinalCoveragePlanSection } from './sections/FinalCoveragePlanSection';
import { JobMatchingDetailSection } from './sections/JobMatchingDetailSection';
import { OverallCoverageSection } from './sections/OverallCoverageSection';
import { SemesterTimelineSection } from './sections/SemesterTimelineSection';
import { TrackCompletionSection } from './sections/TrackCompletionSection';

const SPRING_CONFIG = { damping: 30, stiffness: 300 };

interface JourneyAnalysisReportOverlayProps extends AnalysisReportLocalParams {
  visible: boolean;
  onClose: () => void;
  onOpenChat: () => void;
}

export function JourneyAnalysisReportOverlay({
  visible,
  onClose,
  onOpenChat,
  ...localParams
}: JourneyAnalysisReportOverlayProps) {
  const insets = useSafeAreaInsets();
  const tabBarClearance = getModalBottomTabBarClearance(insets);
  const { width: screenWidth } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);
  const translateX = useSharedValue(screenWidth);

  const stableLocalParams = useMemo(
    () => localParams,
    [
      localParams.roadmap,
      localParams.completedCourses,
      localParams.jobs,
      localParams.trackRecommend,
      localParams.displayName,
      localParams.studentId,
      localParams.studentYear,
    ],
  );

  const { model } = useAnalysisReport({
    localParams: stableLocalParams,
  });

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
            <AnalysisReportHeader subtitle={model.subtitle} onBack={onClose} />

            <View style={styles.sections}>
              <OverallCoverageSection
                roadmap={localParams.roadmap}
                completedCourses={localParams.completedCourses}
              />
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
                expectedPercent={model.expectedPercent}
                remainingCount={model.remainingCount}
                showContributionBadges={model.showContributionBadges}
                remainingCoursePlan={model.remainingCoursePlan}
                prerequisiteWarning={model.prerequisiteWarning}
              />
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
