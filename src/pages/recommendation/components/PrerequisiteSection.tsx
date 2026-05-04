import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../styles/colors';

interface PrerequisiteSectionProps {
  note: string;
}

export function PrerequisiteSection({ note }: PrerequisiteSectionProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>선수과목</Text>
      <Text style={styles.body}>{note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 24,
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
