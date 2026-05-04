import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../styles/colors';

interface TrackDescriptionSectionProps {
  description: string;
}

export function TrackDescriptionSection({ description }: TrackDescriptionSectionProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>트랙 설명</Text>
      <Text style={styles.body}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 10,
  },
  body: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
  },
});
