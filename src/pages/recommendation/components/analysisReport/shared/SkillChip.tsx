import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SkillChipProps {
  label: string;
  variant: 'owned' | 'gap' | 'token';
}

export function SkillChip({ label, variant }: SkillChipProps) {
  const style =
    variant === 'owned' ? styles.owned : variant === 'token' ? styles.token : styles.gap;
  const textStyle =
    variant === 'owned'
      ? styles.ownedText
      : variant === 'token'
        ? styles.tokenText
        : styles.gapText;
  const display =
    variant === 'owned' ? `✓ ${label}` : variant === 'token' ? label : `+ ${label}`;

  return (
    <View style={[styles.chip, style]}>
      <Text style={[styles.text, textStyle]}>{display}</Text>
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
  token: {
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
  tokenText: {
    color: '#B91C1C',
  },
});
