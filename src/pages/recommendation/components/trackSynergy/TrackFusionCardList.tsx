import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import ThunderIcon from '@/src/assets/images/thunder.svg';
import type { FusionCombo } from '../../utils/mapFusionFromSecondary';
import { TrackFusionCard } from './TrackFusionCard';

interface TrackFusionCardListProps {
  combos: FusionCombo[];
}

export function TrackFusionCardList({ combos }: TrackFusionCardListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (combos.length === 0) return null;

  const handlePress = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>학제간 융합 추천</Text>
        <ThunderIcon width={11} height={13} />
      </View>
      <Text style={styles.sectionSub}>혼자선 못 떠올렸을 조합이에요</Text>
      {combos.map((combo, index) => (
        <Animated.View
          key={combo.id}
          entering={FadeInDown.delay(index * 80).duration(200)}
        >
          <TrackFusionCard
            combo={combo}
            selected={selectedId === combo.id}
            onPress={() => handlePress(combo.id)}
          />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  sectionSub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 10,
  },
});
