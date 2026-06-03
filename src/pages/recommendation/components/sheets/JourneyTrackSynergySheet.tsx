import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { TrackRecommendPayload } from '../../../../data/mockTrackRecommendData';
import { colors } from '../../../../styles/colors';
import { TrackRecommendPanel } from '../TrackRecommendPanel';

interface JourneyTrackSynergySheetProps {
  data: TrackRecommendPayload | null;
}

export function JourneyTrackSynergySheet({ data }: JourneyTrackSynergySheetProps) {
  if (!data) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>트랙 추천 데이터가 없습니다</Text>
      </View>
    );
  }

  const score = data.combinationScore;
  const primaryNames = data.primary.map((t) => t.title).join(' + ');

  return (
    <View style={styles.wrap}>
      <View style={styles.scoreBox}>
        <Text style={styles.scoreTitle}>Synergy Score {score}</Text>
        <Text style={styles.scoreSub}>{primaryNames || '추천 트랙 조합'}</Text>
      </View>
      <TrackRecommendPanel data={data} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 8,
  },
  scoreBox: {
    backgroundColor: colors.profileSurface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  scoreTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
  },
  scoreSub: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.textHint,
  },
});
