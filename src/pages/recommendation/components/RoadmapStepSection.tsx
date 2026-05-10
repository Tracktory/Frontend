import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../styles/colors';
import type { RoadmapStep } from '../../../data/mockRoadmapData';
import { RoadmapCourseCard } from './RoadmapCourseCard';

/** 단계(stage)별 색상 매핑 */
const STAGE_COLORS: Record<1 | 2 | 3 | 4, string> = {
  1: colors.stageBasic,
  2: colors.stageCore,
  3: colors.stageApplied,
  4: colors.stageCap,
};

interface RoadmapStepSectionProps {
  step: RoadmapStep;
  /** 마지막 단계이면 도트 아래 연결선 미표시 */
  isLast?: boolean;
}

export function RoadmapStepSection({ step, isLast = false }: RoadmapStepSectionProps) {
  const stageColor = STAGE_COLORS[step.stage];

  return (
    <View style={styles.wrap}>
      {/*
       * 타임라인 컬럼(timelineCol)과 콘텐츠 컬럼(contentCol)을 가로로 나란히 배치.
       * timelineCol이 콘텐츠 전체 높이를 차지하므로 연결선이 끊기지 않음.
       */}
      <View style={styles.bodyRow}>
        {/* ── 왼쪽: 타임라인 컬럼 ── */}
        <View style={styles.timelineCol}>
          {/* 컬러 도트 */}
          <View style={[styles.dot, { backgroundColor: stageColor }]} />
          {/* 도트 아래 연결선 — 마지막 단계는 생략 */}
          {!isLast && <View style={styles.line} />}
        </View>

        {/* ── 오른쪽: 단계 라벨 + 과목 카드 ── */}
        <View style={styles.contentCol}>
          <Text style={[styles.stageLabel, { color: stageColor }]}>
            {step.stage}단계: {step.label}
          </Text>

          {step.courses.map((course) => (
            <RoadmapCourseCard key={course.id} course={course} stageColor={stageColor} />
          ))}
        </View>
      </View>
    </View>
  );
}

const DOT_SIZE = 14;
const TIMELINE_WIDTH = 32;

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 4,
  },
  bodyRow: {
    flexDirection: 'row',
  },

  // 타임라인 컬럼 — bodyRow 안에서 콘텐츠 높이만큼 늘어남
  timelineCol: {
    width: TIMELINE_WIDTH,
    alignItems: 'center',
    paddingBottom: 20,  // contentCol의 하단 여백과 맞춤
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    marginTop: 3,  // 라벨 텍스트 중앙에 맞춤
  },
  // dot 바로 아래부터 timelineCol 하단까지 채우는 선
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginTop: 4,
  },

  // 콘텐츠 컬럼
  contentCol: {
    flex: 1,
    paddingLeft: 8,
    paddingBottom: 20,
  },
  stageLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
});
