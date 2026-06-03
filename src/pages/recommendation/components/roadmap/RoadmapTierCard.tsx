import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { RoadmapTierViewModel } from '../../data/roadmapTierUtils';
import { shouldShowTierWarning } from '../../data/roadmapTierUtils';

interface RoadmapTierCardProps {
  tier: RoadmapTierViewModel;
  completedCourses: string[];
}

const STATUS_STYLES = {
  done: {
    card: { backgroundColor: '#F0FDFA', borderColor: '#CCFBF1' },
    labelColor: '#0D9488',
    icon: 'checkmark-circle' as const,
    iconColor: '#14B8A6',
  },
  current: {
    card: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
    labelColor: '#D97706',
    icon: 'ellipse' as const,
    iconColor: '#F59E0B',
  },
  future: {
    card: { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' },
    labelColor: '#9CA3AF',
    icon: 'ellipse-outline' as const,
    iconColor: '#9CA3AF',
  },
};

export function RoadmapTierCard({ tier, completedCourses }: RoadmapTierCardProps) {
  const style = STATUS_STYLES[tier.status];
  const showWarning = shouldShowTierWarning(tier, tier.status, completedCourses);

  if (tier.courses.length === 0) return null;

  return (
    <View style={[styles.card, style.card]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name={style.icon} size={16} color={style.iconColor} />
          <Text style={[styles.yearLabel, { color: style.labelColor }]}>{tier.label}</Text>
        </View>
        <Text style={styles.count}>
          {tier.doneCount}/{tier.totalCount}
        </Text>
      </View>

      <View style={styles.chipRow}>
        {tier.courses.map((course) => {
          const done = completedCourses.includes(course);
          return (
            <View key={course} style={[styles.chip, done ? styles.chipDone : styles.chipPending]}>
              {done ? (
                <Ionicons name="checkmark-circle" size={10} color="#0D9488" />
              ) : (
                <Ionicons name="close-circle" size={10} color="#EF4444" />
              )}
              <Text style={[styles.chipText, done ? styles.chipTextDone : styles.chipTextPending]}>
                {course}
              </Text>
            </View>
          );
        })}
      </View>

      {showWarning && tier.warning ? (
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={14} color="#EF4444" />
          <Text style={styles.warningText}>{tier.warning}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  yearLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  count: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipDone: {
    backgroundColor: '#CCFBF1',
  },
  chipPending: {
    backgroundColor: '#FEE2E2',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '500',
  },
  chipTextDone: {
    color: '#0D9488',
  },
  chipTextPending: {
    color: '#B91C1C',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    color: '#EF4444',
    lineHeight: 16,
  },
});
