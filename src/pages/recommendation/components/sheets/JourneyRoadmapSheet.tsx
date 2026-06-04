import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { RoadmapPayload } from '../../../../data/mockRoadmapData';
import { RoadmapContent } from '../roadmap/RoadmapContent';

interface JourneyRoadmapSheetProps {
  track1: string;
  track2: string;
  targetJob: string;
  studentYear: number;
  completedCourses: string[];
  roadmap: RoadmapPayload | null;
  onRegister: () => void;
}

export function JourneyRoadmapSheet({
  track1,
  track2,
  targetJob,
  studentYear,
  completedCourses,
  roadmap,
  onRegister,
}: JourneyRoadmapSheetProps) {
  return (
    <View style={styles.wrap}>
      <RoadmapContent
        track1={track1}
        track2={track2}
        targetJob={targetJob}
        studentYear={studentYear}
        completedCourses={completedCourses}
        roadmap={roadmap}
        onRegister={onRegister}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 1,
  },
});
