import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { RoadmapPayload } from '../../../../data/mockRoadmapData';
import { computeCompetencyFromRoadmap } from '../../utils/journeyCompetency';
import { CoverageProgressBar } from './CoverageProgressBar';
import { CoverageRemainingCourseRow } from './CoverageRemainingCourseRow';
import { CoverageReportCta } from './CoverageReportCta';

const REMAINING_PREVIEW_COUNT = 5;

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
  const [showAllRemaining, setShowAllRemaining] = useState(false);

  const stats = useMemo(
    () => computeCompetencyFromRoadmap(roadmap, completedCourses),
    [roadmap, completedCourses],
  );

  const remainingCourses = stats.remainingCourses;
  const hasMoreRemaining = remainingCourses.length > REMAINING_PREVIEW_COUNT;
  const visibleRemaining = showAllRemaining
    ? remainingCourses
    : remainingCourses.slice(0, REMAINING_PREVIEW_COUNT);

  useEffect(() => {
    setShowAllRemaining(false);
  }, [remainingCourses.length, roadmap, completedCourses]);

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

      {remainingCourses.length > 0 ? (
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>필수 잔여 과목</Text>
          {visibleRemaining.map((course) => (
            <CoverageRemainingCourseRow
              key={course.name}
              name={course.name}
              gainLabel={course.gainLabel}
            />
          ))}
          {hasMoreRemaining ? (
            <Pressable
              style={styles.expandBtn}
              onPress={() => setShowAllRemaining((v) => !v)}
              accessibilityRole="button"
              accessibilityLabel={
                showAllRemaining
                  ? '필수 잔여 과목 접기'
                  : `필수 잔여 과목 전체 ${remainingCourses.length}개 보기`
              }
            >
              <Text style={styles.expandBtnText}>
                {showAllRemaining
                  ? '접기'
                  : `외 ${remainingCourses.length - REMAINING_PREVIEW_COUNT}개 더보기`}
              </Text>
              <Ionicons
                name={showAllRemaining ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#0D9488"
              />
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <CoverageReportCta onPress={onShowReport} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 16,
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
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    marginTop: 2,
  },
  expandBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D9488',
  },
});
