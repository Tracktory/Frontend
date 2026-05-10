import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../styles/colors';
import type { RoadmapStep } from '../../../data/mockRoadmapData';
import { RoadmapCourseCard } from './RoadmapCourseCard';

/** 단계(stage)별 색상 매핑 */
const STAGE_COLORS: Record<1 | 2 | 3 | 4, string> = {
  1: colors.stageBasic,
  2: colors.stageCore,
  3: colors.accentBlue,
  4: colors.stageCap,
};

interface RoadmapStepSectionProps {
  step: RoadmapStep;
  /** 마지막 단계이면 연결선을 그리지 않음 */
  isLast?: boolean;
}

export function RoadmapStepSection({ step, isLast = false }: RoadmapStepSectionProps) {
  const stageColor = STAGE_COLORS[step.stage];

  return (
    <View style={styles.wrap}>
      {/* 스텝퍼 헤더 행 */}
      <View style={styles.headerRow}>
        {/* 타임라인 컬럼 */}
        <View style={styles.timelineCol}>
          {/* 컬러 도트 */}
          <View style={[styles.dot, { backgroundColor: stageColor }]} />
          {/* 연결 세로선 */}
          {!isLast && <View style={styles.connector} />}
        </View>

        {/* 단계 라벨 */}
        <Text style={[styles.stageLabel, { color: stageColor }]}>
          {step.stage}단계: {step.label}
        </Text>
      </View>

      {/* 과목 카드 목록 — 타임라인 들여쓰기 맞춤 */}
      <View style={styles.cardsArea}>
        {step.courses.map((course) => (
          <RoadmapCourseCard key={course.id} course={course} stageColor={stageColor} />
        ))}
      </View>
    </View>
  );
}

const DOT_SIZE = 14;
const TIMELINE_WIDTH = 28;

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timelineCol: {
    width: TIMELINE_WIDTH,
    alignItems: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  connector: {
    position: 'absolute',
    top: DOT_SIZE,
    width: 2,
    bottom: -(10 + 8),
    backgroundColor: colors.border,
  },
  stageLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  cardsArea: {
    marginLeft: TIMELINE_WIDTH,
    marginBottom: 16,
  },
});
