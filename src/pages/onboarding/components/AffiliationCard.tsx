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
    backgroundColor: '#F7F8F9',
  },
  selectedCard: {
    backgroundColor: '#F4FFFE',
    shadowColor: 'rgba(20, 184, 166, 0.80)',
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
