import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { RoadmapPayload } from '../../../../data/mockRoadmapData';
import { computeCompetencyFromRoadmap } from '../../utils/journeyCompetency';
import { CoverageProgressBar } from './CoverageProgressBar';
import { CoverageRemainingCourseRow } from './CoverageRemainingCourseRow';
import { CoverageReportCta } from './CoverageReportCta';

interface CompetencyCoverageSheetContentProps {
  roadmap: RoadmapPayload | null;
  completedCourses: string[];
  onShowReport: () => void;
}

export function CompetencyCoverageSheetContent({
  roadmap,
  completedCourses,
  onShowReport,
}: CompetencyCoverageSheetContentProps) {
  const stats = useMemo(
    () => computeCompetencyFromRoadmap(roadmap, completedCourses),
    [roadmap, completedCourses],
  );

  const hint =
    stats.remainingCount > 0
      ? `잔여 ${stats.remainingCount}개 과목 이수 시 ${stats.targetPercent}% 도달`
      : '추천 로드맵 과목을 이수하면 역량이 올라가요';

  return (
    <View style={styles.wrap}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>현재 역량 커버리지</Text>
        <View style={styles.percentRow}>
          <Text style={styles.percentCurrent}>{stats.currentPercent}%</Text>
          <Text style={styles.percentTarget}> → {stats.targetPercent}%</Text>
        </View>
        <CoverageProgressBar percent={stats.currentPercent} />
        <Text style={styles.hint}>{hint}</Text>
      </View>

      {stats.remainingCourses.length > 0 ? (
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>필수 잔여 과목</Text>
          {stats.remainingCourses.map((course) => (
            <CoverageRemainingCourseRow
              key={course.name}
              name={course.name}
              gainLabel={course.gainLabel}
            />
          ))}
        </View>
      ) : null}

      <CoverageReportCta onPress={onShowReport} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 8,
  },
  summaryCard: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 8,
  },
  percentRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
  },
  percentCurrent: {
    fontSize: 40,
    fontWeight: '800',
    color: '#14B8A6',
    lineHeight: 44,
  },
  percentTarget: {
    fontSize: 14,
    color: '#9CA3AF',
    paddingBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: '#0D9488',
    marginTop: 8,
  },
  listSection: {
    marginBottom: 4,
  },
  listTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
});
