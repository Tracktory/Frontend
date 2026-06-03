import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { RoadmapPayload } from '../../../../data/mockRoadmapData';
import { colors } from '../../../../styles/colors';
import { RoadmapPanel } from '../RoadmapPanel';

interface JourneyRoadmapSheetProps {
  roadmap: RoadmapPayload | null;
  isError: boolean;
  onRetry: () => void;
}

export function JourneyRoadmapSheet({ roadmap, isError, onRetry }: JourneyRoadmapSheetProps) {
  return (
    <View style={styles.wrap}>
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
