import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { SecondaryTrack } from '../../../data/mockTrackRecommendData';
import { JobCard } from './JobCard';

interface SecondaryTrackListProps {
  tracks: SecondaryTrack[];
}

export function SecondaryTrackList({ tracks }: SecondaryTrackListProps) {
  return (
    <View style={styles.list}>
      {tracks.map((t) => (
        <JobCard
          key={t.id}
          mode="track"
          title={t.name}
          description=""
          chips={[]}
          emphasized={false}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 0,
  },
});
