import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../styles/colors';
import type { RoadmapPayload } from '../../../data/mockRoadmapData';
import { useOnboardingStore } from '../../../stores/onboardingStore';
import { useProfileStore } from '../../../stores/profileStore';
import {
  applyStudentGradeToSemesterSteps,
  computeRemainingSemestersFromCurrentYear,
} from '../../../utils/roadmapTiming';
import { RoadmapConnectionCard } from './RoadmapConnectionCard';
import { RoadmapSemesterCard } from './RoadmapSemesterCard';
import { CourseDetailModal } from './CourseDetailModal';
import { SemesterGuideSection } from './SemesterGuideSection';

interface RoadmapPanelProps {
  roadmap: RoadmapPayload | null;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function RoadmapPanel({ roadmap, isLoading, isError, onRetry }: RoadmapPanelProps) {
  const completedCourses = useOnboardingStore((s) => s.completedCourses);
  const grade = useOnboardingStore((s) => s.grade);
  const profileCurrentYear = useProfileStore((s) => s.profile?.profile.currentYear);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const hasCompletedCourses = completedCourses.length > 0;

  const semesterSteps = useMemo(() => {
    if (!roadmap) return [];
    return applyStudentGradeToSemesterSteps(roadmap.semesterSteps, grade);
  }, [roadmap, grade]);

  const currentYear = profileCurrentYear ?? grade;

  const { remainingSemesters, semesterRange } = useMemo(
    () => computeRemainingSemestersFromCurrentYear(currentYear),
    [currentYear]
  );

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
      {/* 상단 연결 메시지 카드 */}
      <RoadmapConnectionCard
        connectionMessage={roadmap.connectionMessage}
        hasCompletedCourses={hasCompletedCourses}
        remainingSemesters={remainingSemesters}
        semesterRange={semesterRange}
      />

      {/* 학기별 카드 */}
      {semesterSteps.map((step) => (
        <RoadmapSemesterCard
          key={`${step.year}-${step.semester}`}
          step={step}
          completedCourses={completedCourses}
          onPressCourse={setSelectedCourseId}
        />
      ))}

      {/* 학기별 수강 가이드 */}
      <SemesterGuideSection guide={roadmap.semesterGuide} />

      {/* 과목 상세 모달 */}
      <CourseDetailModal
        courseId={selectedCourseId}
        onClose={() => setSelectedCourseId(null)}
      />
    </View>
  );
}

function RoadmapSkeleton() {
  return (
    <View style={styles.skeleton}>
      <ActivityIndicator size="large" color={colors.primary} style={styles.skeletonSpinner} />
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.skeletonCard}>
          <View style={styles.skeletonHeader} />
          <View style={[styles.skeletonRow, { width: '85%' }]} />
          <View style={[styles.skeletonRow, { width: '70%' }]} />
          <View style={[styles.skeletonRow, { width: '90%' }]} />
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
  skeleton: {
    gap: 12,
  },
  skeletonSpinner: {
    marginBottom: 4,
  },
  skeletonCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  skeletonHeader: {
    height: 20,
    width: '55%',
    backgroundColor: '#ECECEC',
    borderRadius: 6,
  },
  skeletonRow: {
    height: 14,
    backgroundColor: '#ECECEC',
    borderRadius: 6,
  },
});
