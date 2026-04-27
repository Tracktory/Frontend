import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'disabled';
}

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  const isDisabled = variant === 'disabled';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        isDisabled ? styles.disabled : styles.primary,
        pressed && !isDisabled && styles.pressed,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Text style={[styles.label, isDisabled ? styles.disabledLabel : styles.primaryLabel]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    minHeight: 58,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#2563EB',
  },
  disabled: {
    backgroundColor: '#E0E0E0',
  },
  pressed: {
    opacity: 0.9,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
  disabledLabel: {
    color: '#FFFFFF',
  },
});
