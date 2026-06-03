import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { RoadmapPayload } from '../../../../data/mockRoadmapData';
import { colors } from '../../../../styles/colors';
import { computeCompetencyFromRoadmap } from '../../utils/journeyCompetency';
import { applyStudentGradeToSemesterSteps } from '../../../../utils/roadmapTiming';

interface JourneyCurrentStatusSheetProps {
  roadmap: RoadmapPayload | null;
  completedCourses: string[];
  grade: number | null;
  profileCurrentYear: number | null | undefined;
  track1: string;
  track2: string;
}

export function JourneyCurrentStatusSheet({
  roadmap,
  completedCourses,
  grade,
  profileCurrentYear,
  track1,
  track2,
}: JourneyCurrentStatusSheetProps) {
  const studentGrade = profileCurrentYear ?? grade;
  const stats = useMemo(
    () => computeCompetencyFromRoadmap(roadmap, completedCourses),
    [roadmap, completedCourses]
  );

  const currentSemesterLabel = useMemo(() => {
    if (!roadmap || studentGrade == null) return '—';
    const steps = applyStudentGradeToSemesterSteps(roadmap.semesterSteps, studentGrade);
    const current = steps.find((s) => s.timing === 'current');
    if (current) return `${current.year}-${current.semester}`;
    return studentGrade ? `${studentGrade}-1` : '—';
  }, [roadmap, studentGrade]);

  const completedCount = useMemo(() => {
    if (!roadmap) return completedCourses.length;
    let n = 0;
    for (const step of roadmap.semesterSteps) {
      for (const c of step.courses) {
        if (c.completed || completedCourses.includes(c.name) || step.timing === 'past') {
          n += 1;
        }
      }
    }
    return n || completedCourses.length;
  }, [roadmap, completedCourses]);

  const tracks = [track1, track2].filter(Boolean);

  return (
    <View style={styles.wrap}>
      <View style={styles.metricsBox}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>현재 학기</Text>
          <Text style={styles.metricValue}>{currentSemesterLabel}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>핵심 역량</Text>
          <Text style={styles.metricValue}>{stats.currentPercent}%</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>이수 과목</Text>
          <Text style={styles.metricValue}>{completedCount}개</Text>
        </View>
      </View>

      <View style={styles.actionBox}>
        <Text style={styles.actionTitle}>다음 액션</Text>
        <Text style={styles.actionBody}>
          {stats.remainingCourses[0]
            ? `${stats.remainingCourses[0].name} 등 추천 과목을 다음 학기에 수강해 보세요.`
            : '학습 로드맵에서 다음 학기 추천 과목을 확인해 보세요.'}
        </Text>
      </View>

      {tracks.length > 0 ? (
        <>
          <Text style={styles.trackLabel}>선택 트랙</Text>
          <View style={styles.trackRow}>
            {tracks.map((t) => (
              <View key={t} style={styles.trackChip}>
                <Text style={styles.trackChipText}>{t.replace(/트랙$/, '')}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 8,
  },
  metricsBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: colors.profileSurface,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  actionBox: {
    borderWidth: 1,
    borderColor: colors.warningBorder,
    backgroundColor: colors.warningBackground,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.warningText,
    marginBottom: 8,
  },
  actionBody: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  trackLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
  },
  trackRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trackChip: {
    backgroundColor: colors.chipMintBg,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  trackChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
