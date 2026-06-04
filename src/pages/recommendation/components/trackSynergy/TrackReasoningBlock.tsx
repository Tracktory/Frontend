import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../../styles/colors';

interface TrackReasoningBlockProps {
  reasoning?: string | null;
}

export function TrackReasoningBlock({ reasoning }: TrackReasoningBlockProps) {
  const text = reasoning?.trim();
  if (!text) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>추천 이유</Text>
      <Text style={styles.body}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textStrong,
  },
});
