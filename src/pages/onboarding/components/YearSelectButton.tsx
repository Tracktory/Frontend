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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  selectedButton: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
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
  },
});
