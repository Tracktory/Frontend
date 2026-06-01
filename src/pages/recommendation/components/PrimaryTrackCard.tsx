import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { PrimaryTrack } from '../../../data/mockTrackRecommendData';
import { colors } from '../../../styles/colors';

interface PrimaryTrackCardProps {
  track: PrimaryTrack;
}

export function PrimaryTrackCard({ track }: PrimaryTrackCardProps) {
  const hasScore = track.score != null;
  const hasReasoning = (track.reasoning?.trim().length ?? 0) > 0;
  const hasSubjects = track.coreSubjects.length > 0;
  const hasJobs = track.relatedJobs.length > 0;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{track.title}</Text>
        {hasScore ? (
          <Text style={styles.score}>시너지 {track.score}</Text>
        ) : null}
      </View>

      <Text style={styles.rankLabel}>{track.rankLabel}</Text>

      {hasReasoning ? (
        <Text style={styles.reasoning}>선택 이유: {track.reasoning}</Text>
      ) : null}

      {hasSubjects ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>주요 과목:</Text>
          <View style={styles.chipRow}>
            {track.coreSubjects.map((subject) => (
              <View key={subject} style={styles.chip}>
                <Text style={styles.chipText}>{subject}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {hasJobs ? (
        <Text style={styles.jobs}>
          연계 직무: {track.relatedJobs.join(', ')}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: 12,
  },
  score: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  rankLabel: {
    fontSize: 13,
    color: colors.textHint,
    marginBottom: 10,
  },
  reasoning: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  section: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  jobs: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
