import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

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
    borderColor: '#E0E0E0',
    backgroundColor: '#F8F8F8',
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  selectedButton: {
    borderColor: '#2563EB',
    backgroundColor: '#EEF4FF',
  },
  pressed: {
    opacity: 0.92,
  },
  label: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    color: '#333333',
  },
  selectedLabel: {
    color: '#1E40AF',
  },
});
