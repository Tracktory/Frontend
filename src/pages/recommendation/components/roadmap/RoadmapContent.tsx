import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { RoadmapPayload } from '../../../../data/mockRoadmapData';
import { getRoadmapDisplayTiers } from '../../data/roadmapTierUtils';
import { RoadmapTierCard } from './RoadmapTierCard';

interface RoadmapContentProps {
  track1: string;
  track2: string;
  targetJob: string;
  studentYear: number;
  completedCourses: string[];
  roadmap: RoadmapPayload | null;
  onRegister: () => void;
}

export function RoadmapContent({
  track1,
  track2,
  targetJob,
  studentYear,
  completedCourses,
  roadmap,
  onRegister,
}: RoadmapContentProps) {
  const tiers = useMemo(
    () =>
      getRoadmapDisplayTiers({
        track1,
        track2,
        studentYear,
        completedCourses,
        roadmap,
      }),
    [track1, track2, studentYear, completedCourses, roadmap]
  );

  const jobLabel = targetJob !== '직무 미정' ? targetJob : 'Backend Developer';

  return (
    <View style={styles.wrap}>
      <View style={styles.infoBanner}>
        <Text style={styles.infoText}>
          💡 추천된 직무({jobLabel})와 관련있는 과목만 표시됩니다
        </Text>
      </View>

      <View style={styles.tierList}>
        {tiers.map((tier) => (
          <RoadmapTierCard
            key={tier.tier}
            tier={tier}
            completedCourses={completedCourses}
          />
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [styles.editBtn, pressed && styles.editBtnPressed]}
        onPress={onRegister}
      >
        <Ionicons name="library-outline" size={16} color="#14B8A6" />
        <Text style={styles.editBtnText}>이수 과목 수정하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
    paddingBottom: 8,
  },
  infoBanner: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    padding: 12,
  },
  infoText: {
    fontSize: 12,
    color: '#0D9488',
    lineHeight: 18,
  },
  tierList: {
    gap: 12,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#99F6E4',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 4,
  },
  editBtnPressed: {
    opacity: 0.9,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14B8A6',
  },
});
