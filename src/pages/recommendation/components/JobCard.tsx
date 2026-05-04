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
          <Text style={styles.matchScore}>{job.matchScore}%</Text>
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
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    shadowOpacity: 0.1,
  },
  cardPressed: {
    opacity: 0.94,
  },
  header: {
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: 12,
  },
  matchScore: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 10,
  },
  techChip: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  techChipText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  collectingBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  collectingText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '500',
  },
});
