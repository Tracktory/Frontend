import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { SecondaryTrack } from '../../../data/mockTrackRecommendData';
import { colors } from '../../../styles/colors';
import { SecondaryTrackCard } from './SecondaryTrackCard';

interface SecondaryTrackListProps {
  tracks: SecondaryTrack[];
}

export function SecondaryTrackList({ tracks }: SecondaryTrackListProps) {
  if (tracks.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>보조 추천 (학과 경계 확장)</Text>
      {tracks.map((track) => (
        <SecondaryTrackCard key={track.id} track={track} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 10,
  },
});
