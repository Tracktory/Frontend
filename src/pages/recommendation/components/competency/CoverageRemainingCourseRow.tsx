import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CoverageRemainingCourseRowProps {
  name: string;
  gainLabel: string;
}

export function CoverageRemainingCourseRow({
  name,
  gainLabel,
}: CoverageRemainingCourseRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.dot} />
      <Text style={styles.name}>{name}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{gainLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#14B8A6',
  },
  name: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  badge: {
    backgroundColor: '#CCFBF1',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0D9488',
  },
});
