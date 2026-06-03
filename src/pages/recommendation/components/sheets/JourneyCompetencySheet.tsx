import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { RoadmapPayload } from '../../../../data/mockRoadmapData';
import { colors } from '../../../../styles/colors';
import { computeCompetencyFromRoadmap } from '../../utils/journeyCompetency';

interface JourneyCompetencySheetProps {
  roadmap: RoadmapPayload | null;
  completedCourses: string[];
}

export function JourneyCompetencySheet({
  roadmap,
  completedCourses,
}: JourneyCompetencySheetProps) {
  const stats = useMemo(
    () => computeCompetencyFromRoadmap(roadmap, completedCourses),
    [roadmap, completedCourses]
  );

  const fillPercent = Math.min(100, stats.currentPercent);

  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionLabel}>현재 역량 커버리지</Text>
      <View style={styles.percentRow}>
        <Text style={styles.percentCurrent}>{stats.currentPercent}%</Text>
        <Text style={styles.percentArrow}> → </Text>
        <Text style={styles.percentTarget}>{stats.targetPercent}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${fillPercent}%` }]} />
      </View>
      <Text style={styles.hint}>
        {stats.remainingCount > 0
          ? `잔여 ${stats.remainingCount}개 과목 이수 시 ${stats.targetPercent}% 도달`
          : '추천 로드맵 과목을 이수하면 역량이 올라가요'}
      </Text>

      {stats.remainingCourses.length > 0 ? (
        <>
          <Text style={styles.listTitle}>필수 잔여 과목</Text>
          {stats.remainingCourses.map((course) => (
            <View key={course.name} style={styles.courseRow}>
              <View style={styles.dot} />
              <Text style={styles.courseName}>{course.name}</Text>
              <View style={styles.gainBadge}>
                <Text style={styles.gainText}>{course.gainLabel}</Text>
              </View>
            </View>
          ))}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 8,
  },
  sectionLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  percentRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  percentCurrent: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  percentArrow: {
    fontSize: 20,
    color: colors.textHint,
  },
  percentTarget: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textHint,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginBottom: 10,
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  hint: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: 10,
    backgroundColor: colors.white,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  courseName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  gainBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gainText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
});
