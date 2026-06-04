import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { ReportSemesterItem } from '../../../utils/buildAnalysisReportModel';
import type { SemesterTiming } from '../../../../../data/mockRoadmapData';
import { AnalysisReportSection } from '../AnalysisReportSection';
import { ReportAccordion } from '../shared/ReportAccordion';

interface SemesterTimelineSectionProps {
  semesters: ReportSemesterItem[];
  defaultExpandedIndex: number;
}

function statusStyles(status: SemesterTiming) {
  if (status === 'past') {
    return {
      dot: '#14B8A6',
      cardBg: '#F0FDFA',
      border: '#CCFBF1',
      icon: 'checkmark-circle' as const,
      iconColor: '#14B8A6',
    };
  }
  if (status === 'current') {
    return {
      dot: '#FBBF24',
      cardBg: '#FFFBEB',
      border: '#FDE68A',
      icon: 'ellipse' as const,
      iconColor: '#FBBF24',
    };
  }
  return {
    dot: '#D1D5DB',
    cardBg: '#FFFFFF',
    border: '#E5E7EB',
    icon: 'ellipse-outline' as const,
    iconColor: '#9CA3AF',
  };
}

export function SemesterTimelineSection({
  semesters,
  defaultExpandedIndex,
}: SemesterTimelineSectionProps) {
  const [expandedSem, setExpandedSem] = useState<number | null>(defaultExpandedIndex);

  if (semesters.length === 0) {
    return (
      <AnalysisReportSection title="학기별 학습 타임라인" iconName="book">
        <Text style={styles.empty}>로드맵 학기 정보가 없습니다.</Text>
      </AnalysisReportSection>
    );
  }

  return (
    <AnalysisReportSection title="학기별 학습 타임라인" iconName="book">
      <View style={styles.timeline}>
        {semesters.map((sem, i) => {
          const st = statusStyles(sem.status);
          const isLast = i === semesters.length - 1;
          return (
            <View key={sem.key} style={styles.timelineRow}>
              <View style={styles.lineCol}>
                <Ionicons name={st.icon} size={18} color={st.iconColor} />
                {!isLast ? <View style={[styles.line, { backgroundColor: st.dot }]} /> : null}
              </View>
              <View style={styles.accordionCol}>
                <ReportAccordion
                  expanded={expandedSem === i}
                  onToggle={() => setExpandedSem(expandedSem === i ? null : i)}
                  header={
                    <View style={styles.semHeader}>
                      <Text style={styles.semLabel}>{sem.label}</Text>
                      <Text style={styles.credits}>{sem.credits}학점</Text>
                    </View>
                  }
                >
                  <View
                    style={[
                      styles.courseBox,
                      { backgroundColor: st.cardBg, borderColor: st.border },
                    ]}
                  >
                    {sem.courses.map((c) => (
                      <View key={c} style={styles.courseChip}>
                        <Text style={styles.courseText}>{c}</Text>
                      </View>
                    ))}
                  </View>
                </ReportAccordion>
              </View>
            </View>
          );
        })}
      </View>
    </AnalysisReportSection>
  );
}

const styles = StyleSheet.create({
  empty: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  timeline: {
    gap: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 12,
  },
  lineCol: {
    width: 24,
    alignItems: 'center',
  },
  line: {
    flex: 1,
    width: 2,
    opacity: 0.35,
    marginVertical: 4,
    minHeight: 24,
  },
  accordionCol: {
    flex: 1,
  },
  semHeader: {
    flex: 1,
  },
  semLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  credits: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  courseBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    gap: 6,
  },
  courseChip: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  courseText: {
    fontSize: 12,
    color: '#374151',
  },
});
