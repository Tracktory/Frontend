import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { JobRecommendation } from '../../../../data/mockRecommendData';
import { colors } from '../../../../styles/colors';
import { JobMatchingSheetContent } from '../jobMatching/JobMatchingSheetContent';

interface JourneyJobMatchingSheetProps {
  jobs: JobRecommendation[];
  hasJobData: boolean;
  onShowBriefing: () => void;
}

export function JourneyJobMatchingSheet({
  jobs,
  hasJobData,
  onShowBriefing,
}: JourneyJobMatchingSheetProps) {
  if (!hasJobData || jobs.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>데이터 추가 예정입니다</Text>
        <Text style={styles.emptySub}>곧 직무 추천 데이터가 업데이트됩니다</Text>
      </View>
    );
  }

  return <JobMatchingSheetContent jobs={jobs} onShowBriefing={onShowBriefing} />;
}

const styles = StyleSheet.create({
  empty: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptySub: {
    marginTop: 8,
    fontSize: 13,
    color: colors.textHint,
  },
});
