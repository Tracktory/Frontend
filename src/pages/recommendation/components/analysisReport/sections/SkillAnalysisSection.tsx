import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { SkillTokenItem } from '../../../data/analysisReportStaticMock';
import { AnalysisReportSection } from '../AnalysisReportSection';
import { SkillChip } from '../shared/SkillChip';

interface SkillAnalysisSectionProps {
  skillTokens: SkillTokenItem[];
  anchorCoveragePercent: number;
}

export function SkillAnalysisSection({
  skillTokens,
  anchorCoveragePercent,
}: SkillAnalysisSectionProps) {
  return (
    <AnalysisReportSection title="역량 분야별 분석" iconName="trending-up">
      <Text style={styles.caption}>
        기준 직무 역량 충족률 {anchorCoveragePercent}% · 부족 역량 토큰
      </Text>
      {skillTokens.length > 0 ? (
        <View style={styles.chipGrid}>
          {skillTokens.map((token) => (
            <SkillChip key={token.label} label={token.label} variant="token" />
          ))}
        </View>
      ) : (
        <Text style={styles.empty}>부족 역량 토큰 데이터가 없습니다.</Text>
      )}
    </AnalysisReportSection>
  );
}

const styles = StyleSheet.create({
  caption: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 10,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  empty: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});
