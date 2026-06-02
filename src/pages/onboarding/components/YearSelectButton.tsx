import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../../../styles/colors';

interface YearSelectButtonProps {
  year: number;
  selected: boolean;
  onPress: () => void;
}

export function YearSelectButton({ year, selected, onPress }: YearSelectButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        selected && styles.selectedButton,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{year}년</Text>
      {selected ? <Text style={styles.check}>✓</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingVertical: 22,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: colors.selectSurface,
  },
  selectedButton: {
    backgroundColor: colors.selectSurfaceActive,
  },
  pressed: {
    opacity: 0.92,
  },
  label: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  selectedLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
  check: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
});
