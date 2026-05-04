import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../styles/colors';

interface LlmSynergySectionProps {
  body: string;
}

export function LlmSynergySection({ body }: LlmSynergySectionProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>트랙 조합 장단점 (LLM 분석)</Text>
      <View style={styles.box}>
        <Text style={styles.body}>{body}</Text>
      </View>
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
  box: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
  },
  body: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
  },
});
