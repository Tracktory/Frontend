import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { TrackRecommendPayload } from '../../../../data/mockTrackRecommendData';
import { mapFusionFromSecondary } from '../../utils/mapFusionFromSecondary';
import { TrackFusionCardList } from './TrackFusionCardList';
import { TrackPrimaryItemRow } from './TrackPrimaryItemRow';
import { TrackSynergyScoreBox } from './TrackSynergyScoreBox';

interface TrackSynergySheetContentProps {
  data: TrackRecommendPayload;
}

export function TrackSynergySheetContent({ data }: TrackSynergySheetContentProps) {
  const [selectedRank, setSelectedRank] = useState<1 | 2 | null>(null);

  const fusionCombos = useMemo(
    () => mapFusionFromSecondary(data.secondary),
    [data.secondary],
  );

  const primaryNames = data.primary.map((t) => t.title).join(' + ');
  const subtitle =
    primaryNames ||
    data.trackDescription?.trim() ||
    data.llmSynergy?.trim() ||
    '추천 트랙 조합';

  const handlePrimaryPress = (rank: 1 | 2) => {
    setSelectedRank((prev) => (prev === rank ? null : rank));
  };

  return (
    <View style={styles.wrap}>
      <TrackSynergyScoreBox score={data.combinationScore} subtitle={subtitle} />

      <Text style={styles.sectionTitle}>주요 추천 트랙</Text>
      <View style={styles.primaryList}>
        {data.primary.map((track) => (
          <TrackPrimaryItemRow
            key={track.rank}
            track={track}
            selected={selectedRank === track.rank}
            onPress={() => handlePrimaryPress(track.rank)}
          />
        ))}
      </View>

      <TrackFusionCardList combos={fusionCombos} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  primaryList: {
    marginBottom: 12,
  },
});
