import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface HorizontalBarRowProps {
  name: string;
  value: number;
  color: string;
}

export function HorizontalBarRow({ name, value, color }: HorizontalBarRowProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <View style={styles.row}>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${clamped}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.value}>{clamped}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  name: {
    width: 88,
    fontSize: 11,
    color: '#4B5563',
  },
  barTrack: {
    flex: 1,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
  },
  barFill: {
    height: 14,
    borderRadius: 7,
  },
  value: {
    width: 36,
    fontSize: 11,
    fontWeight: '600',
    color: '#14B8A6',
    textAlign: 'right',
  },
});
