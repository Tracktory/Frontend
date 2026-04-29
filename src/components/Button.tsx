import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../styles/colors';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'disabled';
  subtitle?: string;
}

export function Button({ title, onPress, variant = 'primary', subtitle }: ButtonProps) {
  const isDisabled = variant === 'disabled';

  return (
    <View>
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
  disabled: {
    backgroundColor: colors.border,
  },
  pressed: {
    opacity: 0.9,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  primaryLabel: {
    color: colors.white,
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
