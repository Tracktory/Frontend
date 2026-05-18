import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../styles/colors';
import type { RoadmapPayload } from '../../../data/mockRoadmapData';
import { RoadmapStepSection } from './RoadmapStepSection';
import { SemesterGuideSection } from './SemesterGuideSection';

interface RoadmapPanelProps {
  roadmap: RoadmapPayload | null;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onPressCourse?: (courseId: string) => void;
}

export function RoadmapPanel({ roadmap, isLoading, isError, onRetry, onPressCourse }: RoadmapPanelProps) {
  if (isLoading) {
    return <RoadmapSkeleton />;
  }

  if (isError || !roadmap) {
    return (
      <View style={styles.errorContainer}>
        <RoadmapSkeleton />
        <View style={styles.retryOverlay}>
          <Text style={styles.errorText}>데이터를 불러오지 못했습니다</Text>
          <Pressable style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View>
      {roadmap.steps.map((step, index) => (
        <RoadmapStepSection
          key={step.stage}
          step={step}
          isLast={index === roadmap.steps.length - 1}
          onPressCourse={onPressCourse}
        />
      ))}
      <SemesterGuideSection guide={roadmap.semesterGuide} />
    </View>
  );
}

/** 로딩 중 스켈레톤 — 단계 헤더 + 카드 2장 x 4단계 모양 */
function RoadmapSkeleton() {
  return (
    <View style={styles.skeleton}>
      <ActivityIndicator size="large" color={colors.primary} style={styles.skeletonSpinner} />
      {[1, 2, 3, 4].map((stage) => (
        <View key={stage} style={styles.skeletonStage}>
          <View style={styles.skeletonHeader} />
          <View style={[styles.skeletonCard, { width: '95%' }]} />
          <View style={[styles.skeletonCard, { width: '80%' }]} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    position: 'relative',
  },
  retryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },

  // 스켈레톤
  skeleton: {
    gap: 12,
  },
  skeletonSpinner: {
    marginBottom: 4,
  },
  skeletonStage: {
    gap: 8,
    marginBottom: 8,
  },
  skeletonHeader: {
    height: 20,
    width: '50%',
    backgroundColor: '#ECECEC',
    borderRadius: 6,
  },
  skeletonCard: {
    height: 72,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginLeft: 28,
  },
});
