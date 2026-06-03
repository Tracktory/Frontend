import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface JobMatchingCardProps {
  title: string;
  matchScore: number;
  chips: string[];
}

export function JobMatchingCard({ title, matchScore, chips }: JobMatchingCardProps) {
  const showChips = chips.length > 0;

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {matchScore > 0 ? (
          <View style={styles.matchPill}>
            <Text style={styles.matchText}>{matchScore}% 매칭</Text>
          </View>
        ) : null}
      </View>
      {showChips ? (
        <View style={styles.chipRow}>
          {chips.map((chip) => (
            <View key={chip} style={styles.chip}>
              <Text style={styles.chipText}>{chip}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  matchPill: {
    backgroundColor: '#CCFBF1',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: '#F0FDFA',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#0D9488',
  },
});
