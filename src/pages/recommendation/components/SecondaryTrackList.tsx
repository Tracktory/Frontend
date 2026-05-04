import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../styles/colors';
import type { SecondaryTrack } from '../../../data/mockTrackRecommendData';

interface SecondaryTrackListProps {
  tracks: SecondaryTrack[];
}

export function SecondaryTrackList({ tracks }: SecondaryTrackListProps) {
  return (
    <View style={styles.list}>
      {tracks.map((t) => (
        <View
          key={t.id}
          style={[styles.row, t.emphasized ? styles.rowEmphasized : styles.rowDefault]}
        >
          <Text style={styles.name}>{t.name}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  row: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  rowDefault: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  rowEmphasized: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
