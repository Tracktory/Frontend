import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const REASONING_PLACEHOLDER = '추천 근거가 준비 중이에요.';

interface JobMatchingCardProps {
  title: string;
  matchScore: number;
  chips: string[];
  reasoning: string;
  isActive: boolean;
  onPress: () => void;
}

export function JobMatchingCard({
  title,
  matchScore,
  chips,
  reasoning,
  isActive,
  onPress,
}: JobMatchingCardProps) {
  const showChips = chips.length > 0;
  const reasoningText = reasoning.trim() || REASONING_PLACEHOLDER;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      style={({ pressed }) => [
        styles.card,
        isActive ? styles.cardActive : styles.cardInactive,
        pressed && styles.cardPressed,
      ]}
    >
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
        <View style={[styles.chipRow, isActive && styles.chipRowWithReasoning]}>
          {chips.map((chip) => (
            <View key={chip} style={styles.chip}>
              <Text style={styles.chipText}>{chip}</Text>
            </View>
          ))}
        </View>
      ) : null}
      {isActive ? (
        <View style={styles.reasoningBlock}>
          <View style={styles.reasoningDivider} />
          <Text style={styles.reasoningText}>{reasoningText}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
  },
  cardInactive: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardActive: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: '#14B8A6',
  },
  cardPressed: {
    opacity: 0.92,
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
  chipRowWithReasoning: {
    marginBottom: 0,
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
  reasoningBlock: {
    marginTop: 12,
  },
  reasoningDivider: {
    height: 1,
    backgroundColor: '#CCFBF1',
    marginBottom: 10,
  },
  reasoningText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
});
