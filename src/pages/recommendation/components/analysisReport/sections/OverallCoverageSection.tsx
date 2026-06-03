import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { AnalysisReportModel } from '../../../utils/buildAnalysisReportModel';
import { AnalysisReportSection } from '../AnalysisReportSection';
import { CircularGauge } from '../charts/CircularGauge';
import { CoverageProgressBar } from '../../competency/CoverageProgressBar';

interface OverallCoverageSectionProps {
  model: Pick<
    AnalysisReportModel,
    | 'currentPercent'
    | 'targetPercent'
    | 'remainingCount'
    | 'completedCourseCount'
    | 'earnedCredits'
  >;
}

export function OverallCoverageSection({ model }: OverallCoverageSectionProps) {
  const {
    currentPercent,
    targetPercent,
    remainingCount,
    completedCourseCount,
    earnedCredits,
  } = model;

  return (
    <AnalysisReportSection title="종합 역량 커버리지" iconName="flag">
      <View style={styles.topRow}>
        <CircularGauge
          size={100}
          percent={currentPercent}
          subLabel="현재"
        />
        <View style={styles.rightCol}>
          <Text style={styles.hint}>
            잔여 <Text style={styles.hintStrong}>{remainingCount}개 과목</Text> 이수 시{'\n'}
            <Text style={styles.hintTarget}>{targetPercent}%</Text>에 도달해요
          </Text>
          <View style={styles.barLabels}>
            <Text style={styles.barLabel}>현재 {currentPercent}%</Text>
            <Text style={styles.barLabel}>목표 {targetPercent}%</Text>
          </View>
          <CoverageProgressBar percent={currentPercent} />
          <View style={styles.targetTrack}>
            <View
              style={[styles.targetFill, { width: `${Math.min(100, targetPercent)}%` }]}
            />
          </View>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statPill}>
          <Text style={styles.statValue}>{completedCourseCount}개</Text>
          <Text style={styles.statLabel}>이수 과목</Text>
        </View>
        <View style={styles.statPill}>
          <Text style={styles.statValue}>{earnedCredits}학점</Text>
          <Text style={styles.statLabel}>취득 학점</Text>
        </View>
        <View style={styles.statPill}>
          <Text style={styles.statValue}>{remainingCount}개</Text>
          <Text style={styles.statLabel}>남은 과목</Text>
        </View>
      </View>
    </AnalysisReportSection>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  rightCol: {
    flex: 1,
  },
  hint: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  hintStrong: {
    color: '#14B8A6',
    fontWeight: '700',
  },
  hintTarget: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  targetTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
    overflow: 'hidden',
  },
  targetFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCFBF1',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statPill: {
    flex: 1,
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D9488',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
});
