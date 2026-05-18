import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../styles/colors';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'disabled' | 'secondary';
  subtitle?: string;
}

export function Button({ title, onPress, variant = 'primary', subtitle }: ButtonProps) {
  const isDisabled = variant === 'disabled';

  const buttonStyle = () => {
    if (variant === 'secondary') return styles.secondary;
    if (variant === 'disabled') return styles.disabled;
    return styles.primary;
  };

  const labelStyle = () => {
    if (variant === 'secondary') return styles.secondaryLabel;
    if (variant === 'disabled') return styles.disabledLabel;
    return styles.primaryLabel;
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.base,
          buttonStyle(),
          pressed && !isDisabled && styles.pressed,
        ]}
        onPress={onPress}
        disabled={isDisabled}
      >
        <Text style={[styles.label, labelStyle()]}>{title}</Text>
      </Pressable>
      {subtitle ? (
        <View style={styles.subtitleSlot}>
          <Text style={styles.subtitleText}>{subtitle}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  base: {
    width: '100%',
    minHeight: 58,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.chipSurface,
  },
  disabled: {
    backgroundColor: colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  primaryLabel: {
    color: colors.white,
  },
  secondaryLabel: {
    color: colors.textSecondary,
  },
  disabledLabel: {
    color: colors.white,
  },
  subtitleSlot: {
    minHeight: 18,
    marginTop: 8,
    justifyContent: 'flex-start',
  },
  subtitleText: {
    fontSize: 13,
    color: colors.textHint,
    textAlign: 'center',
  },
});
