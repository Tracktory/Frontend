import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { TrackRecommendPayload } from '../../../data/mockTrackRecommendData';
import { PrimaryTrackCard } from './PrimaryTrackCard';
import { SecondaryTrackList } from './SecondaryTrackList';
import { TrackCombinationBanner } from './TrackCombinationBanner';

interface TrackRecommendPanelProps {
  data: TrackRecommendPayload;
}

export function TrackRecommendPanel({ data }: TrackRecommendPanelProps) {
  const trackNames = data.primary.map((t) => t.title);

  return (
    <View style={styles.wrap}>
      <TrackCombinationBanner
        score={data.combinationScore}
        trackNames={trackNames}
        combinationReasoning={data.combinationReasoning}
      />
      {data.primary.map((track) => (
        <PrimaryTrackCard key={track.rank} track={track} />
      ))}
      <SecondaryTrackList tracks={data.secondary} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
  },
});
