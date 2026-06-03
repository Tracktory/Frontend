import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SkillChipProps {
  label: string;
  variant: 'owned' | 'gap';
}

export function SkillChip({ label, variant }: SkillChipProps) {
  const owned = variant === 'owned';
  return (
    <View style={[styles.chip, owned ? styles.owned : styles.gap]}>
      <Text style={[styles.text, owned ? styles.ownedText : styles.gapText]}>
        {owned ? `✓ ${label}` : `+ ${label}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  owned: {
    backgroundColor: '#CCFBF1',
  },
  gap: {
    backgroundColor: '#FEF2F2',
  },
  text: {
    fontSize: 11,
  },
  ownedText: {
    color: '#0D9488',
  },
  gapText: {
    color: '#EF4444',
  },
});
