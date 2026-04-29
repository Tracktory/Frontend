import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

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
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#F8F8F8',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  chipSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB',
  },
  chipDisabled: {
    opacity: 0.45,
  },
  chipText: {
    fontSize: 14,
    color: '#555555',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.9,
  },
});
