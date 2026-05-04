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
    <View>
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
      {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}
    </View>
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
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: '#F4F4F4',
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
  subtitleText: {
    marginTop: 8,
    fontSize: 13,
    color: colors.textHint,
    textAlign: 'center',
  },
});
