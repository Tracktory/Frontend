import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { RemainingCoursePlan } from '../../../data/analysisReportStaticMock';
import { AnalysisReportSection } from '../AnalysisReportSection';
import { CircularGauge } from '../charts/CircularGauge';

interface FinalCoveragePlanSectionProps {
  currentPercent: number;
  targetPercent: number;
  expectedPercent: number;
  remainingCount: number;
  showContributionBadges: boolean;
  remainingCoursePlan: RemainingCoursePlan[];
  prerequisiteWarning: string;
}

export function FinalCoveragePlanSection({
  currentPercent,
  targetPercent,
  expectedPercent,
  remainingCount,
  showContributionBadges,
  remainingCoursePlan,
  prerequisiteWarning,
}: FinalCoveragePlanSectionProps) {
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

      <View style={styles.divider} />

      <View style={styles.planHeader}>
        <Ionicons name="ellipse" size={12} color="#0D9488" />
        <Text style={styles.planTitle}>{expectedPercent}% 달성 잔여 과목 플랜</Text>
      </View>

      {remainingCoursePlan.length === 0 ? (
        <Text style={styles.emptyPlan}>잔여 필수 과목이 없습니다.</Text>
      ) : (
        remainingCoursePlan.map((c, i) => (
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
              {showContributionBadges && c.impact !== '—' ? (
                <View style={styles.impactPill}>
                  <Text style={styles.impactText}>{c.impact}</Text>
                </View>
              ) : null}
              <Ionicons
                name={expandedCourse === i ? 'chevron-up' : 'chevron-down'}
                size={13}
                color="#9CA3AF"
              />
            </Pressable>
            {expandedCourse === i ? (
              <View style={styles.courseDetail}>
                <Text style={styles.courseDesc}>
                  <Text style={styles.courseDescBold}>{c.area}</Text>
                  {` · ${c.sem}`}
                  {showContributionBadges && c.impact !== '—'
                    ? ` — 역량 ${c.impact} 기여 예상`
                    : ''}
                </Text>
              </View>
            ) : null}
          </View>
        ))
      )}

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
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 16,
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
  emptyPlan: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 12,
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
