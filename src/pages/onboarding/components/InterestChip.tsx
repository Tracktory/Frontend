import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../../../styles/colors';

interface InterestChipProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export function InterestChip({ label, selected, disabled = false, onPress }: InterestChipProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        disabled && !selected && styles.chipDisabled,
        pressed && !disabled && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled && !selected}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 100,
    backgroundColor: '#F4F4F4',
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  chipDisabled: {
    opacity: 0.35,
  },
  chipText: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
});
