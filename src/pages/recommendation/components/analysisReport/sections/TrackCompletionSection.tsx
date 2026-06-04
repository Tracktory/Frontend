import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { TrackBarItem } from '../../../data/analysisReportStaticMock';
import { AnalysisReportSection } from '../AnalysisReportSection';
import { HorizontalBarRow } from '../charts/HorizontalBarRow';

interface TrackCompletionSectionProps {
  trackBars: TrackBarItem[];
  synergyTip: string;
}

export function TrackCompletionSection({
  trackBars,
  synergyTip,
}: TrackCompletionSectionProps) {
  return (
    <AnalysisReportSection title="트랙 완성도" iconName="star">
      {trackBars.map((bar) => (
        <HorizontalBarRow
          key={bar.name}
          name={bar.name}
          value={bar.value}
          color={bar.color}
        />
      ))}
      <View style={styles.tip}>
        <Text style={styles.tipText}>{synergyTip}</Text>
      </View>
    </AnalysisReportSection>
  );
}

const styles = StyleSheet.create({
  tip: {
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#CCFBF1',
  },
  tipText: {
    fontSize: 12,
    color: '#0D9488',
    lineHeight: 18,
  },
});
