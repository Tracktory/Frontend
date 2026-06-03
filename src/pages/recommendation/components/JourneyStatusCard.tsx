import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RoadmapPayload } from '../../../data/mockRoadmapData';
import { colors } from '../../../styles/colors';
import { computeCompetencyFromRoadmap } from '../utils/journeyCompetency';

interface JourneyStatusCardProps {
  roadmap: RoadmapPayload | null;
  completedCourses: string[];
  onPress?: () => void;
}

export function JourneyStatusCard({
  roadmap,
  completedCourses,
  onPress,
}: JourneyStatusCardProps) {
  const stats = useMemo(
    () => computeCompetencyFromRoadmap(roadmap, completedCourses),
    [roadmap, completedCourses]
  );

  const nextLabel = useMemo(() => {
    const names = stats.remainingCourses.map((c) => c.name);
    if (names.length === 0) return '로드맵 확인하기';
    if (names.length === 1) return names[0];
    return `${names[0]} 외 ${names.length - 1}과목`;
  }, [stats.remainingCourses]);

  const content = (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.label}>역량</Text>
        <Text style={styles.percent}>{stats.currentPercent}%</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.right}>
        <Text style={styles.label}>다음 학기 추천</Text>
        <Text style={styles.next} numberOfLines={2}>
          {nextLabel}
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 4,
    marginBottom: 8,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 2,
  },
  left: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  right: {
    flex: 1.2,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  percent: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primary,
  },
  next: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 22,
  },
});
