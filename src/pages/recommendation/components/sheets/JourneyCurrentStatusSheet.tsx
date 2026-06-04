import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { RoadmapPayload } from '../../../../data/mockRoadmapData';
import { applyStudentGradeToSemesterSteps } from '../../../../utils/roadmapTiming';
import { buildCurrentStatusNextAction } from '../../utils/buildCurrentStatusNextAction';
import { computeCompetencyFromRoadmap } from '../../utils/journeyCompetency';

interface JourneyCurrentStatusSheetProps {
  roadmap: RoadmapPayload | null;
  completedCourses: string[];
  grade: number | null;
  profileCurrentYear: number | null | undefined;
  track1: string;
  track2: string;
  recommendationId: number | null;
}

function formatTrackChipLabel(track: string): string {
  return track.replace(/트랙$/, '').trim();
}

export function JourneyCurrentStatusSheet({
  roadmap,
  completedCourses,
  grade,
  profileCurrentYear,
  track1,
  track2,
  recommendationId,
}: JourneyCurrentStatusSheetProps) {
  const studentGrade = profileCurrentYear ?? grade;
  const stats = useMemo(
    () => computeCompetencyFromRoadmap(roadmap, completedCourses),
    [roadmap, completedCourses],
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

  const nextActionMessage = useMemo(
    () => buildCurrentStatusNextAction(recommendationId),
    [recommendationId],
  );

  const tracks = [track1, track2].filter(Boolean).map(formatTrackChipLabel);

  return (
    <View style={styles.wrap}>
      <View style={styles.metricsBox}>
        <Text style={styles.metricsTitle}>현재 학습 진행 상황</Text>
        <View style={styles.metricsRow}>
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
      </View>

      <View style={styles.actionBox}>
        <Text style={styles.actionTitle}>다음 액션</Text>
        <Text style={styles.actionBody}>{nextActionMessage}</Text>
      </View>

      {tracks.length > 0 ? (
        <View style={styles.tracksSection}>
          <Text style={styles.trackLabel}>선택 트랙</Text>
          <View style={styles.trackRow}>
            {tracks.map((t) => (
              <View key={t} style={styles.trackChip}>
                <Text style={styles.trackChipText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 4,
  },
  metricsBox: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  metricsTitle: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#14B8A6',
  },
  actionBox: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
    marginBottom: 6,
  },
  actionBody: {
    fontSize: 13,
    lineHeight: 21,
    color: '#78716C',
  },
  tracksSection: {
    gap: 8,
  },
  trackLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  trackRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trackChip: {
    backgroundColor: '#CCFBF1',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  trackChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D9488',
  },
});
