import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type {
  RemainingCoursePlan,
  SkillComparison,
} from '../../../data/analysisReportStaticMock';
import { AnalysisReportSection } from '../AnalysisReportSection';
import { CircularGauge } from '../charts/CircularGauge';

interface FinalCoveragePlanSectionProps {
  currentPercent: number;
  targetPercent: number;
  remainingCount: number;
  skillComparison: SkillComparison[];
  remainingCoursePlan: RemainingCoursePlan[];
  prerequisiteWarning: string;
}

export function FinalCoveragePlanSection({
  currentPercent,
  targetPercent,
  remainingCount,
  skillComparison,
  remainingCoursePlan,
  prerequisiteWarning,
}: FinalCoveragePlanSectionProps) {
  const [showProjected, setShowProjected] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);

  return (
    <AnalysisReportSection title="최종 역량 커버리지 & 달성 플랜" iconName="bar-chart">
      <View style={styles.gaugeRow}>
        <View style={styles.gaugeCol}>
          <CircularGauge size={80} percent={currentPercent} subLabel="현재" />
        </View>
        <View style={styles.arrowCol}>
          <View style={styles.arrowLine} />
          <Text style={styles.arrowLabel}>+{remainingCount}과목</Text>
        </View>
        <View style={styles.gaugeCol}>
          <CircularGauge
            size={80}
            percent={targetPercent}
            strokeColor="#0D9488"
            trackColor="#CCFBF1"
            valueColor="#0D9488"
            subLabel="이수 후"
          />
        </View>
      </View>

      <Pressable
        style={styles.toggleBtn}
        onPress={() => setShowProjected((v) => !v)}
      >
        <Text style={styles.toggleText}>분야별 역량 변화 보기</Text>
        <Ionicons
          name={showProjected ? 'chevron-up' : 'chevron-down'}
          size={14}
          color="#0D9488"
        />
      </Pressable>

      {showProjected ? (
        <View style={styles.comparisonBlock}>
          {skillComparison.map((s) => (
            <View key={s.subject} style={styles.comparisonRow}>
              <View style={styles.comparisonHeader}>
                <Text style={styles.comparisonSubject}>{s.subject}</Text>
                <Text style={styles.comparisonValues}>
                  <Text style={styles.currentVal}>{s.current}%</Text>
                  {' → '}
                  <Text style={styles.projectedVal}>{s.projected}%</Text>
                </Text>
              </View>
              <View style={styles.stackedTrack}>
                <View style={[styles.stackedCurrent, { width: `${s.current}%` }]} />
                <View
                  style={[
                    styles.stackedDelta,
                    { width: `${Math.max(0, s.projected - s.current)}%` },
                  ]}
                />
              </View>
            </View>
          ))}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#14B8A6' }]} />
              <Text style={styles.legendText}>현재</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendDotLight]} />
              <Text style={styles.legendText}>이수 후 증가</Text>
            </View>
          </View>
        </View>
      ) : null}

      <View style={styles.divider} />

      <View style={styles.planHeader}>
        <Ionicons name="ellipse" size={12} color="#0D9488" />
        <Text style={styles.planTitle}>95% 달성 필수 과목 플랜</Text>
      </View>

      {remainingCoursePlan.map((c, i) => (
        <View key={`${c.name}-${i}`}>
          <Pressable
            style={[
              styles.courseBtn,
              expandedCourse === i ? styles.courseBtnExpanded : null,
            ]}
            onPress={() => setExpandedCourse(expandedCourse === i ? null : i)}
          >
            <View style={styles.courseIndex}>
              <Text style={styles.courseIndexText}>{i + 1}</Text>
            </View>
            <View style={styles.courseInfo}>
              <Text style={styles.courseName}>{c.name}</Text>
              <Text style={styles.courseMeta}>
                {c.credits}학점 · {c.sem} · {c.area}
              </Text>
            </View>
            <View style={styles.impactPill}>
              <Text style={styles.impactText}>{c.impact}</Text>
            </View>
            <Ionicons
              name={expandedCourse === i ? 'chevron-up' : 'chevron-down'}
              size={13}
              color="#9CA3AF"
            />
          </Pressable>
          {expandedCourse === i ? (
            <View style={styles.courseDetail}>
              <View style={styles.impactBarLabels}>
                <Text style={styles.impactBarLabel}>커버리지 기여도</Text>
                <Text style={styles.impactBarValue}>{c.impact}</Text>
              </View>
              <View style={styles.impactBarTrack}>
                <View
                  style={[
                    styles.impactBarFill,
                    {
                      width: `${Math.min(100, parseInt(c.impact.replace(/\D/g, ''), 10) * 10)}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.courseDesc}>
                <Text style={styles.courseDescBold}>{c.area}</Text> 역량을 강화하며 전체
                커버리지 {c.impact} 향상에 기여합니다.
              </Text>
            </View>
          ) : null}
        </View>
      ))}

      <View style={styles.warning}>
        <View style={styles.warningHeader}>
          <Ionicons name="warning" size={13} color="#D97706" />
          <Text style={styles.warningTitle}>수강 전 유의사항</Text>
        </View>
        <Text style={styles.warningBody}>{prerequisiteWarning}</Text>
      </View>
    </AnalysisReportSection>
  );
}

const styles = StyleSheet.create({
  gaugeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  gaugeCol: {
    alignItems: 'center',
  },
  arrowCol: {
    alignItems: 'center',
    gap: 4,
  },
  arrowLine: {
    width: 32,
    height: 2,
    backgroundColor: '#2DD4BF',
  },
  arrowLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#14B8A6',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 8,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D9488',
  },
  comparisonBlock: {
    paddingTop: 8,
    gap: 10,
  },
  comparisonRow: {
    marginBottom: 4,
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  comparisonSubject: {
    fontSize: 11,
    color: '#4B5563',
  },
  comparisonValues: {
    fontSize: 11,
    color: '#6B7280',
  },
  currentVal: {
    color: '#9CA3AF',
  },
  projectedVal: {
    color: '#0D9488',
    fontWeight: '700',
  },
  stackedTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  stackedCurrent: {
    height: 8,
    backgroundColor: '#14B8A6',
  },
  stackedDelta: {
    height: 8,
    backgroundColor: '#CCFBF1',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendDotLight: {
    backgroundColor: '#CCFBF1',
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  legendText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  planTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  courseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
    marginBottom: 8,
  },
  courseBtnExpanded: {
    backgroundColor: '#F0FDFA',
    borderColor: '#99F6E4',
  },
  courseIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseIndexText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  courseMeta: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  impactPill: {
    backgroundColor: '#CCFBF1',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  impactText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  courseDetail: {
    marginTop: -4,
    marginBottom: 8,
    marginHorizontal: 4,
    padding: 16,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#99F6E4',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: '#F0FDFA',
  },
  impactBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  impactBarLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  impactBarValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  impactBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CCFBF1',
    marginBottom: 8,
    overflow: 'hidden',
  },
  impactBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#14B8A6',
  },
  courseDesc: {
    fontSize: 11,
    color: '#0D9488',
    lineHeight: 18,
  },
  courseDescBold: {
    fontWeight: '600',
  },
  warning: {
    marginTop: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  warningTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  warningBody: {
    fontSize: 11,
    color: '#B45309',
    lineHeight: 18,
  },
});
