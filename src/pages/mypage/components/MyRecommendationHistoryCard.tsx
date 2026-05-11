import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../styles/colors';
import type { RecommendationHistoryItem } from '../../../data/mockMyPageData';

interface MyRecommendationHistoryCardProps {
  items: RecommendationHistoryItem[];
  onItemPress: (item: RecommendationHistoryItem) => void;
}

export function MyRecommendationHistoryCard({
  items,
  onItemPress,
}: MyRecommendationHistoryCardProps) {
  return (
    <>
      <Text style={styles.sectionTitle}>추천 이력</Text>
      <View style={styles.card}>
        {items.map((item, index) => (
          <View key={item.id}>
            <Pressable
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
              onPress={() => onItemPress(item)}
            >
              <View style={styles.rowTexts}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textHint} />
            </Pressable>
            {index < items.length - 1 ? <View style={styles.divider} /> : null}
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  rowPressed: {
    backgroundColor: colors.inputSurface,
  },
  rowTexts: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  date: {
    fontSize: 12,
    color: colors.textHint,
    fontWeight: '500',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginHorizontal: 12,
  },
});
