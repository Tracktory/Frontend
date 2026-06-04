import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SkillChipProps {
  label: string;
  variant: 'owned' | 'gap' | 'token' | 'skill';
}

export function SkillChip({ label, variant }: SkillChipProps) {
  const style =
    variant === 'owned'
      ? styles.owned
      : variant === 'skill'
        ? styles.skill
        : variant === 'token'
          ? styles.token
          : styles.gap;
  const textStyle =
    variant === 'owned'
      ? styles.ownedText
      : variant === 'skill'
        ? styles.skillText
        : variant === 'token'
          ? styles.tokenText
          : styles.gapText;
  const display =
    variant === 'owned' ? `✓ ${label}` : variant === 'gap' ? `+ ${label}` : label;

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
  skill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  skillText: {
    color: '#4B5563',
  },
});
