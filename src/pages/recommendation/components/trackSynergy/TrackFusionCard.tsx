import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { FusionCombo } from '../../utils/mapFusionFromSecondary';

interface TrackFusionCardProps {
  combo: FusionCombo;
}

export function TrackFusionCard({ combo }: TrackFusionCardProps) {
  const title =
    combo.major2 && combo.major2 !== combo.major1
      ? `${combo.major1} × ${combo.major2}`
      : combo.major1;

  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>✨ 이색 조합</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.jobRow}>
        <Text style={styles.arrow}>→</Text>
        <Text style={styles.job}>{combo.job}</Text>
      </View>
      <View style={styles.chevron}>
        <Ionicons name="chevron-forward" size={16} color="#14B8A6" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#EDE9FE',
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    paddingRight: 88,
  },
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: 24,
  },
  arrow: {
    fontSize: 13,
    fontWeight: '600',
    color: '#14B8A6',
  },
  job: {
    flex: 1,
    fontSize: 13,
    color: '#4B5563',
  },
  chevron: {
    position: 'absolute',
    bottom: 14,
    right: 12,
  },
});
