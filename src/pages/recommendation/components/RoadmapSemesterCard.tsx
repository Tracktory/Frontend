import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../styles/colors';
import type { SemesterStep } from '../../../data/mockRoadmapData';

const STAGE_COLORS: Record<1 | 2 | 3 | 4, string> = {
  1: colors.stageBasic,
  2: colors.stageCore,
  3: colors.stageApplied,
  4: colors.stageCap,
};

interface RoadmapSemesterCardProps {
  step: SemesterStep;
  completedCourses: string[];
  onPressCourse: (courseId: string) => void;
}

export function RoadmapSemesterCard({ step, completedCourses, onPressCourse }: RoadmapSemesterCardProps) {
  const stageColor = STAGE_COLORS[step.stageNumber];

  const courseCompletions = step.courses.map((c) => completedCourses.includes(c.name));
  const earnedCredits = step.courses.reduce(
    (sum, c, i) => sum + (courseCompletions[i] ? c.credits : 0),
    0
  );
  const allCompleted = courseCompletions.every(Boolean);

  return (
    <View style={[styles.card, allCompleted && styles.cardCompleted]}>
      {/* 카드 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.semesterTitle, allCompleted && styles.textMuted]}>
            {step.year}학년 {step.semester}학기
          </Text>
          <View style={[styles.stageBadge, { backgroundColor: allCompleted ? '#E5E7EB' : `${stageColor}22` }]}>
            <Text style={[styles.stageBadgeText, { color: allCompleted ? colors.textHint : stageColor }]}>
              {step.stageLabel}
            </Text>
          </View>
        </View>
        <Text style={[styles.credits, allCompleted && styles.textMuted]}>
          {earnedCredits} / {step.totalCredits} 학점
        </Text>
      </View>

      {/* 단계 설명 */}
      <Text style={[styles.stageDesc, allCompleted && styles.textMuted]}>
        이번 학기는 트랙 {step.stageLabel} 단계입니다
      </Text>

      {/* 과목 목록 */}
      <View style={styles.courseList}>
        {step.courses.map((course, i) => {
          const completed = courseCompletions[i];
          return (
            <Pressable
              key={course.id}
              style={({ pressed }) => [
                styles.courseRow,
                i < step.courses.length - 1 && styles.courseRowBorder,
                pressed && styles.courseRowPressed,
              ]}
              onPress={() => onPressCourse(course.id)}
              accessibilityLabel={`${course.name} 상세 보기`}
            >
              <View style={[styles.dot, { backgroundColor: completed ? colors.textHint : stageColor }]} />
              <Text style={[styles.courseName, completed && styles.courseNameCompleted]}>
                {course.name}
              </Text>
              <Text style={[styles.courseCredits, completed && styles.textMuted]}>
                {course.credits}학점
              </Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={completed ? colors.textHint : colors.textSecondary}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const DOT_SIZE = 8;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cardCompleted: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  semesterTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stageBadge: {
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  stageBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  credits: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  stageDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  courseList: {
    gap: 0,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
  },
  courseRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  courseRowPressed: {
    opacity: 0.7,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  courseName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  courseNameCompleted: {
    color: colors.textHint,
  },
  courseCredits: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  textMuted: {
    color: colors.textHint,
  },
});
