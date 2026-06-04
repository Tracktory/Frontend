import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { RoadmapPayload } from '../../../../data/mockRoadmapData';
import { CompetencyCoverageBlock } from './CompetencyCoverageBlock';

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
  return (
    <View style={styles.wrap}>
      <CompetencyCoverageBlock
        roadmap={roadmap}
        completedCourses={completedCourses}
        showReportCta
        onShowReport={onShowReport}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 16,
  },
});
