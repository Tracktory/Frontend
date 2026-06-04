import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { AnalysisReportModel } from '../../../utils/buildAnalysisReportModel';
import { AnalysisReportSection } from '../AnalysisReportSection';
import { CircularGauge } from '../charts/CircularGauge';
import { CoverageProgressBar } from '../../competency/CoverageProgressBar';
import { SkillChip } from '../shared/SkillChip';

interface OverallCoverageSectionProps {
  model: Pick<
    AnalysisReportModel,
    | 'currentPercent'
    | 'nextActionsPercent'
    | 'expectedPercent'
    | 'showNextActionsTier'
    | 'remainingCount'
    | 'completedCourseCount'
    | 'earnedCredits'
    | 'gapTokens'
  >;
}

export function OverallCoverageSection({ model }: OverallCoverageSectionProps) {
  const {
    currentPercent,
    nextActionsPercent,
    expectedPercent,
    showNextActionsTier,
    remainingCount,
    completedCourseCount,
    earnedCredits,
    gapTokens,
  } = model;

  const hintTarget = showNextActionsTier ? nextActionsPercent : expectedPercent;
  const hintMiddle = showNextActionsTier ? '다음 액션 과목' : '로드맵 전체';

  return (
    <AnalysisReportSection title="종합 역량 커버리지" iconName="flag">
      <View style={styles.topRow}>
        <CircularGauge size={100} percent={currentPercent} subLabel="현재" />
        <View style={styles.rightCol}>
          <Text style={styles.hint}>
            잔여 <Text style={styles.hintStrong}>{remainingCount}개 과목</Text> 이수 시{'\n'}
            <Text style={styles.hintTarget}>{hintTarget}%</Text>에 도달해요
            {showNextActionsTier ? ` (전체 ${expectedPercent}%)` : ''}
          </Text>
          <View style={styles.barLabels}>
            <Text style={styles.barLabel}>현재 {currentPercent}%</Text>
            {showNextActionsTier ? (
              <Text style={styles.barLabel}>다음 {nextActionsPercent}%</Text>
            ) : null}
            <Text style={styles.barLabel}>전체 {expectedPercent}%</Text>
          </View>
          <CoverageProgressBar percent={currentPercent} />
          {showNextActionsTier ? (
            <View style={styles.nextTrack}>
              <View
                style={[
                  styles.nextFill,
                  { width: `${Math.min(100, nextActionsPercent)}%` },
                ]}
              />
            </View>
          ) : null}
          <View style={styles.targetTrack}>
            <View
              style={[
                styles.targetFill,
                { width: `${Math.min(100, expectedPercent)}%` },
              ]}
            />
          </View>
          <Text style={styles.tierHint}>
            {showNextActionsTier
              ? `3단: 현재 → ${hintMiddle} → 로드맵 전체`
              : '2단: 현재 → 로드맵 전체 (선택 기준 직무)'}
          </Text>
        </View>
      </View>

      {gapTokens.length > 0 ? (
        <View style={styles.gapBlock}>
          <Text style={styles.gapTitle}>부족 역량</Text>
          <View style={styles.gapChips}>
            {gapTokens.slice(0, 8).map((token) => (
              <SkillChip key={token} label={token} variant="gap" />
            ))}
          </View>
        </View>
      ) : null}

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
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  nextTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
    overflow: 'hidden',
  },
  nextFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#5EEAD4',
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
  tierHint: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 6,
  },
  gapBlock: {
    marginBottom: 12,
  },
  gapTitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  gapChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
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
