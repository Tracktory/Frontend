import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { SecondaryTrack } from '../../../data/mockTrackRecommendData';
import { colors } from '../../../styles/colors';

interface SecondaryTrackCardProps {
  track: SecondaryTrack;
}

export function SecondaryTrackCard({ track }: SecondaryTrackCardProps) {
  const hasScore = track.score != null;
  const hasReasoning = (track.reasoning?.trim().length ?? 0) > 0;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{track.name}</Text>
        {hasScore ? <Text style={styles.score}>{track.score}</Text> : null}
      </View>
      {hasReasoning ? (
        <Text style={styles.reasoning}>{track.reasoning}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.inputSurface,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: 12,
  },
  score: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  reasoning: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
