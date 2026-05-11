import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../styles/colors';
import type { RoadmapCourse } from '../../../data/mockRoadmapData';

interface RoadmapCourseCardProps {
  course: RoadmapCourse;
  /** 단계 색상 — 우선순위 배지 텍스트에 사용 */
  stageColor: string;
}

export function RoadmapCourseCard({ course, stageColor }: RoadmapCourseCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* 우선순위 배지 */}
        <View style={[styles.badge, { borderColor: stageColor }]}>
          <Text style={[styles.badgeText, { color: stageColor }]}>{course.priority}순위</Text>
        </View>

        <View style={styles.content}>
          {/* 과목명 */}
          <Text style={styles.name}>{course.name}</Text>
          {/* LLM 시너지 설명 */}
          <Text style={styles.description}>{course.description}</Text>

          {/* 선수과목 미이수 경고 */}
          {course.prerequisiteUnmet ? (
            <View style={styles.prereqWarning}>
              <Text style={styles.prereqText}>
                △ 선수과목: {course.prerequisiteUnmet} 미이수
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginTop: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  prereqWarning: {
    marginTop: 6,
    backgroundColor: '#FFF8E7',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  prereqText: {
    fontSize: 12,
    color: '#B45309',
    fontWeight: '500',
  },
});
