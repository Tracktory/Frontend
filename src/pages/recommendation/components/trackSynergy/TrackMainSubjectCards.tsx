import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { TrackSubjectRef } from '../../../../data/mockTrackRecommendData';
import { colors } from '../../../../styles/colors';

interface TrackMainSubjectCardsProps {
  subjects: TrackSubjectRef[];
}

export function TrackMainSubjectCards({ subjects }: TrackMainSubjectCardsProps) {
  if (subjects.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>주요 과목</Text>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.row}
      >
        {subjects.map((subject, index) => (
          <View key={`${subject.name}-${index}`} style={styles.card}>
            <Text style={styles.name} numberOfLines={2}>
              {subject.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 10,
    marginHorizontal: -4,
    overflow: 'visible',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
    marginHorizontal: 4,
  },
  scroll: {
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
    paddingRight: 12,
  },
  card: {
    flexShrink: 0,
    width: 132,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 18,
  },
});
