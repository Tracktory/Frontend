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
        selected ? styles.selectedCard : styles.defaultCard,
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
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultCard: {
    backgroundColor: colors.selectSurface,
  },
  selectedCard: {
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
