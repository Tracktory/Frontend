import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MySectionCard } from './MySectionCard';

interface MyInterestChipsSectionProps {
  interests: string[];
}

export function MyInterestChipsSection({ interests }: MyInterestChipsSectionProps) {
  if (interests.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <MySectionCard title="관심 분야" iconName="heart-outline">
        <View style={styles.chipRow}>
          {interests.map((item) => (
            <View key={item} style={styles.chip}>
              <Text style={styles.chipText}>{item}</Text>
            </View>
          ))}
        </View>
      </MySectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 13,
    color: '#0D9488',
    fontWeight: '500',
  },
});
