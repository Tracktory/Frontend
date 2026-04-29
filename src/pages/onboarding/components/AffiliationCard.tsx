import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../../../styles/colors';

interface AffiliationCardProps {
  title: string;
  selected?: boolean;
  onPress: () => void;
}

export function AffiliationCard({ title, selected = false, onPress }: AffiliationCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        selected && styles.selectedCard,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.title, selected && styles.selectedTitle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  pressed: {
    opacity: 0.92,
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  selectedTitle: {
    color: colors.primary,
  },
});
