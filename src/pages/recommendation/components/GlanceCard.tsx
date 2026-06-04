import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import TargetIcon from '@/src/assets/images/target.svg';
import { GlanceProgressBar } from './GlanceProgressBar';

export interface GlanceCardProps {
  isExploring: boolean;
  targetJob: string;
  competencyPercent: number;
  jobCandidateCount?: number;
  onPress?: () => void;
}

export function GlanceCard({
  isExploring,
  targetJob,
  competencyPercent,
  jobCandidateCount = 0,
  onPress,
}: GlanceCardProps) {
  const clampedPercent = Math.min(100, Math.max(0, competencyPercent));

  const content = (
    <View style={styles.card}>
      {isExploring ? (
        <Text style={styles.exploreText}>
          🧭 직무 탐색 중 · 관심사 기반 후보 {jobCandidateCount}개
        </Text>
      ) : (
        <>
          <View style={styles.row1}>
            <View style={styles.targetRow}>
              <TargetIcon width={20} height={20} />
              <Text style={styles.targetText} numberOfLines={1}>
                목표 {targetJob}
              </Text>
            </View>
            <Text style={styles.percentText}>{clampedPercent}%</Text>
          </View>
          <View style={styles.row2}>
            <Text style={styles.barLabel}>필요 역량</Text>
            <GlanceProgressBar percent={clampedPercent} />
          </View>
        </>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={styles.pressable}>
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  pressable: {
    zIndex: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  exploreText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 21,
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  targetRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 12,
    minWidth: 0,
  },
  targetText: {
    flex: 1,
    fontSize: 13,
    color: '#4B5563',
  },
  percentText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D9488',
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    flexShrink: 0,
  },
});
