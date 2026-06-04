import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../../styles/colors';
import type { FusionCombo } from '../../utils/mapFusionFromSecondary';
import { TrackMainSubjectCards } from './TrackMainSubjectCards';
import { TrackReasoningBlock } from './TrackReasoningBlock';

interface TrackFusionCardProps {
  combo: FusionCombo;
  selected: boolean;
  onPress: () => void;
}

export function TrackFusionCard({ combo, selected, onPress }: TrackFusionCardProps) {
  const title =
    combo.major2 && combo.major2 !== combo.major1
      ? `${combo.major1} × ${combo.major2}`
      : combo.major1;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>이색 조합</Text>
        </View>
      </View>

      {selected ? (
        <View style={styles.expanded}>
          <TrackReasoningBlock reasoning={combo.reasoning} />
          <TrackMainSubjectCards subjects={combo.mainSubjects} />
          <View style={styles.collapseHint}>
            <Ionicons name="chevron-up" size={16} color={colors.primary} />
          </View>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.onboardingChipSelectedBg,
  },
  cardPressed: {
    opacity: 0.92,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  badge: {
    flexShrink: 0,
    backgroundColor: '#EDE9FE',
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  expanded: {
    marginTop: 8,
    overflow: 'visible',
  },
  collapseHint: {
    alignItems: 'center',
    marginTop: 8,
  },
});
