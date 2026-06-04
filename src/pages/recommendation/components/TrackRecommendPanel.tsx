import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { TrackRecommendPayload } from '../../../data/mockTrackRecommendData';
import { PrimaryTrackCard } from './PrimaryTrackCard';
import { SecondaryTrackList } from './SecondaryTrackList';
import { TrackCombinationBanner } from './TrackCombinationBanner';

interface TrackRecommendPanelProps {
  data: TrackRecommendPayload;
  showSecondary?: boolean;
  showRelatedJobs?: boolean;
}

export function TrackRecommendPanel({
  data,
  showSecondary = true,
  showRelatedJobs = true,
}: TrackRecommendPanelProps) {
  const trackNames = data.primary.map((t) => t.title);

  return (
    <View style={styles.wrap}>
      <TrackCombinationBanner
        score={data.combinationScore}
        trackNames={trackNames}
        combinationReasoning={data.combinationReasoning}
      />
      {data.primary.map((track) => (
        <PrimaryTrackCard
          key={track.rank}
          track={track}
          showRelatedJobs={showRelatedJobs}
        />
      ))}
      {showSecondary ? <SecondaryTrackList tracks={data.secondary} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
  },
});
