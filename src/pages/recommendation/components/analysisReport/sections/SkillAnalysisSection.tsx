import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { SkillRadarPoint } from '../../../data/analysisReportStaticMock';
import { AnalysisReportSection } from '../AnalysisReportSection';
import { SkillRadarChart } from '../charts/SkillRadarChart';

interface SkillAnalysisSectionProps {
  skillRadar: SkillRadarPoint[];
}

export function SkillAnalysisSection({ skillRadar }: SkillAnalysisSectionProps) {
  return (
    <AnalysisReportSection title="역량 분야별 분석" iconName="trending-up">
      <SkillRadarChart data={skillRadar} />
      <View style={styles.grid}>
        {skillRadar.map((s) => (
          <View key={s.subject} style={styles.gridItem}>
            <View style={styles.miniHeader}>
              <Text style={styles.miniLabel}>{s.subject}</Text>
              <Text style={styles.miniValue}>{s.value}%</Text>
            </View>
            <View style={styles.miniTrack}>
              <View style={[styles.miniFill, { width: `${s.value}%` }]} />
            </View>
          </View>
        ))}
      </View>
    </AnalysisReportSection>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  gridItem: {
    width: '48%',
  },
  miniHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  miniLabel: {
    fontSize: 11,
    color: '#4B5563',
  },
  miniValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#14B8A6',
  },
  miniTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  miniFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#14B8A6',
  },
});
