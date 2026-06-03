import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { FusionCombo } from '../../utils/mapFusionFromSecondary';
import { TrackFusionCard } from './TrackFusionCard';

interface TrackFusionCardListProps {
  combos: FusionCombo[];
}

export function TrackFusionCardList({ combos }: TrackFusionCardListProps) {
  if (combos.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>학제간 융합 추천 ⚡</Text>
      <Text style={styles.sectionSub}>혼자선 못 떠올렸을 조합이에요</Text>
      {combos.map((combo, index) => (
        <Animated.View
          key={combo.id}
          entering={FadeInDown.delay(index * 80).duration(200)}
        >
          <TrackFusionCard combo={combo} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 10,
  },
});
