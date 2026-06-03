import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { RoadmapPayload } from '../../../../data/mockRoadmapData';
import { colors } from '../../../../styles/colors';
import { RoadmapPanel } from '../RoadmapPanel';

interface JourneyRoadmapSheetProps {
  roadmap: RoadmapPayload | null;
  isError: boolean;
  onRetry: () => void;
}

function formatNextSemesterLabel(roadmap: RoadmapPayload | null): string | null {
  const names = roadmap?.semesterGuide?.nextSemester ?? [];
  if (names.length === 0) return null;
  if (names.length === 1) return names[0];
  return `${names[0]} 외 ${names.length - 1}과목`;
}

export function JourneyRoadmapSheet({ roadmap, isError, onRetry }: JourneyRoadmapSheetProps) {
  const nextSemesterLabel = useMemo(() => formatNextSemesterLabel(roadmap), [roadmap]);

  return (
    <View style={styles.wrap}>
      {nextSemesterLabel ? (
        <View style={styles.nextSemesterBox}>
          <Text style={styles.nextSemesterLabel}>다음 학기 추천</Text>
          <Text style={styles.nextSemesterValue}>{nextSemesterLabel}</Text>
        </View>
      ) : null}
      <View style={styles.hintBox}>
        <Text style={styles.hintText}>
          추천된 직무와 관련 있는 과목만 표시됩니다
        </Text>
      </View>
      <RoadmapPanel roadmap={roadmap} isLoading={false} isError={isError} onRetry={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 8,
  },
  nextSemesterBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    padding: 14,
    marginBottom: 12,
  },
  nextSemesterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  nextSemesterValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  hintBox: {
    backgroundColor: colors.warningBackground,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  hintText: {
    fontSize: 13,
    color: colors.warningText,
    lineHeight: 20,
  },
});
