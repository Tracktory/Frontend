import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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

import { useAuthStore } from '../../../../stores/authStore';
import { useAnalysisReport } from '../../../../hooks/useAnalysisReport';
import { getModalBottomTabBarClearance } from '../../../../navigation/layout/tabBarLayout';
import type { AnalysisReportLocalParams } from '../../../../hooks/useAnalysisReport';
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

  const accessToken = useAuthStore((s) => s.accessToken);

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
    ]
  );

  const {
    model,
    isLoading,
    errorMessage,
    selectAnchorJobCode,
    retry,
  } = useAnalysisReport({
    visible,
    accessToken,
    localParams: stableLocalParams,
    onFatalError: onClose,
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

  const showContent = !isLoading && !errorMessage;

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
              anchorJobLabel={model.anchorJobLabel}
              onBack={onClose}
            />

            {isLoading ? (
              <View style={styles.centerBox}>
                <ActivityIndicator size="large" color="#14B8A6" />
                <Text style={styles.loadingText}>리포트를 불러오는 중이에요</Text>
              </View>
            ) : null}

            {errorMessage ? (
              <View style={styles.centerBox}>
                <Text style={styles.errorText}>{errorMessage}</Text>
                <Pressable style={styles.retryBtn} onPress={retry}>
                  <Text style={styles.retryText}>다시 시도</Text>
                </Pressable>
              </View>
            ) : null}

            {showContent ? (
              <View style={styles.sections}>
                <OverallCoverageSection model={model} />
                <SkillAnalysisSection
                  skillTokens={model.skillTokens}
                  anchorCoveragePercent={model.anchorCoveragePercent}
                />
                <TrackCompletionSection
                  trackBars={model.trackBars}
                  synergyTip={model.synergyTip}
                />
                <JobMatchingDetailSection
                  jobs={model.jobs}
                  onSelectJobCode={selectAnchorJobCode}
                />
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
                  skillComparison={model.skillComparison}
                  remainingCoursePlan={model.remainingCoursePlan}
                  prerequisiteWarning={model.prerequisiteWarning}
                />
                <AIActionsSection actions={model.aiActions} />
                <AnalysisReportFooter onOpenChat={onOpenChat} />
              </View>
            ) : null}
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
  centerBox: {
    paddingHorizontal: 20,
    paddingVertical: 48,
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#14B8A6',
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
