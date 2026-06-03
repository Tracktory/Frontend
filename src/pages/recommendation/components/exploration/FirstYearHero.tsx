import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import type { JobRecommendation } from '../../../../data/mockRecommendData';
import { mapJobsToExplorationCards } from '../../data/explorationJobMock';

interface FirstYearHeroProps {
  jobs: JobRecommendation[];
  onOpenTrack: () => void;
  onOpenRegister: () => void;
}

export function FirstYearHero({ jobs, onOpenTrack, onOpenRegister }: FirstYearHeroProps) {
  const cards = useMemo(() => mapJobsToExplorationCards(jobs), [jobs]);

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>관심사 기반 추천 직무</Text>

        {cards.map((job, index) => (
          <Animated.View
            key={job.id}
            entering={FadeInDown.delay(index * 100).duration(350)}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <View style={styles.matchPill}>
                <Text style={styles.matchText}>{job.matchScore}%</Text>
              </View>
            </View>
            <Text style={styles.reason}>{job.reason}</Text>
            <Pressable style={styles.trackLink} onPress={onOpenTrack} hitSlop={8}>
              <Text style={styles.trackLinkText}>이 직무로 가는 트랙 보기</Text>
              <Ionicons name="chevron-forward" size={16} color="#14B8A6" />
            </Pressable>
          </Animated.View>
        ))}

        <Animated.View entering={FadeInDown.delay(400).duration(350)}>
          <Pressable
            style={({ pressed }) => [styles.nudge, pressed && styles.nudgePressed]}
            onPress={onOpenRegister}
          >
            <Text style={styles.nudgeTitle}>📚 이미 들은 과목이 있나요?</Text>
            <View style={styles.nudgeRow}>
              <Text style={styles.nudgeSub}>추가하면 추천이 더 정확해져요</Text>
              <Ionicons name="chevron-forward" size={16} color="#0D9488" />
            </View>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 12,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 130,
    paddingBottom: 180,
    paddingHorizontal: 0,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D9488',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  jobTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  matchPill: {
    backgroundColor: '#CCFBF1',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  matchText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D9488',
  },
  reason: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  trackLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trackLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14B8A6',
  },
  nudge: {
    marginTop: 4,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#99F6E4',
    backgroundColor: '#F0FDFA',
  },
  nudgePressed: {
    opacity: 0.92,
  },
  nudgeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  nudgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nudgeSub: {
    fontSize: 12,
    color: '#6B7280',
  },
});
