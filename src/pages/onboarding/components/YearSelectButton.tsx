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
        selected ? styles.selectedButton : styles.defaultButton,
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
    borderRadius: 12,
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  defaultButton: {
    backgroundColor: colors.selectSurface,
  },
  selectedButton: {
    backgroundColor: colors.selectSurfaceActive,
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
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
