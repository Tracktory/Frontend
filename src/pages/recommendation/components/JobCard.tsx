import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../styles/colors';
import type { JobRecommendation } from '../../../data/mockRecommendData';

interface JobCardProps {
  job: JobRecommendation;
  selected: boolean;
  onPress: () => void;
}

export function JobCard({ job, selected, onPress }: JobCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.matchScore}>매칭 {job.matchScore}%</Text>
        </View>
        <Text style={styles.description}>{job.description}</Text>
      </View>

      <View style={styles.techRow}>
        {job.techStackReady ? (
          job.techStack.map((tech) => (
            <View key={tech} style={styles.techChip}>
              <Text style={styles.techChipText}>{tech}</Text>
            </View>
          ))
        ) : (
          <View style={styles.collectingBadge}>
            <Text style={styles.collectingText}>수집 중</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  cardPressed: {
    opacity: 0.92,
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  matchScore: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  techChip: {
    backgroundColor: colors.primaryLight,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  techChipText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  collectingBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  collectingText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '500',
  },
});
