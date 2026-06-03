import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TrackPrimaryItemRowProps {
  label: string;
  tag?: string;
}

export function TrackPrimaryItemRow({ label, tag = 'PRIMARY' }: TrackPrimaryItemRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.tagPill}>
        <Text style={styles.tagText}>{tag}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#0D9488',
    marginRight: 12,
  },
  tagPill: {
    backgroundColor: '#14B8A6',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
