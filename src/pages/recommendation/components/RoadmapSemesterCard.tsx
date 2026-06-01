import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../styles/colors';
import type { SemesterCourse, SemesterStep } from '../../../data/mockRoadmapData';

const STAGE_COLORS: Record<1 | 2 | 3 | 4, string> = {
  1: colors.stageBasic,
  2: colors.stageCore,
  3: colors.stageApplied,
  4: colors.stageCap,
};

function isCourseCompleted(course: SemesterCourse, completedCourses: string[]): boolean {
  if (course.completed === true) return true;
  if (course.completed === false) return false;
  return completedCourses.includes(course.name);
}

function hasUnmetPrerequisite(course: SemesterCourse): boolean {
  return (course.prerequisites ?? []).some((p) => !p.completed);
}

interface RoadmapSemesterCardProps {
  step: SemesterStep;
  completedCourses: string[];
  onPressCourse: (courseId: string) => void;
}

export function RoadmapSemesterCard({ step, completedCourses, onPressCourse }: RoadmapSemesterCardProps) {
  const stageColor = STAGE_COLORS[step.stageNumber];
  const isPastSemester = step.timing === 'past';

  const courseCompletions = step.courses.map((c) => isCourseCompleted(c, completedCourses));
  const earnedCredits = step.courses.reduce(
    (sum, c, i) => sum + (courseCompletions[i] ? c.credits : 0),
    0
  );
  const allCompleted = step.courses.length > 0 && courseCompletions.every(Boolean);
  const semesterMuted = isPastSemester || allCompleted;

  return (
    <View style={[styles.card, semesterMuted && styles.cardCompleted]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.semesterTitle, semesterMuted && styles.textMuted]}>
            {step.year}학년 {step.semester}학기
          </Text>
          <View style={[styles.stageBadge, { backgroundColor: semesterMuted ? '#E5E7EB' : `${stageColor}22` }]}>
            <Text style={[styles.stageBadgeText, { color: semesterMuted ? colors.textHint : stageColor }]}>
              {step.stageLabel}
            </Text>
          </View>
          {isPastSemester && (
            <View style={styles.pastBadge}>
              <Text style={styles.pastBadgeText}>이수</Text>
            </View>
          )}
        </View>
        <Text style={[styles.credits, semesterMuted && styles.textMuted]}>
          {earnedCredits} / {step.totalCredits} 학점
        </Text>
      </View>

      <Text style={[styles.stageDesc, semesterMuted && styles.textMuted]}>
        이번 학기는 트랙 {step.stageLabel} 단계입니다
      </Text>

      <View style={styles.courseList}>
        {step.courses.map((course, i) => {
          const completed = courseCompletions[i];
          const unmetPrereq = hasUnmetPrerequisite(course);
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
              <View
                style={[
                  styles.dot,
                  { backgroundColor: completed ? colors.textHint : stageColor },
                ]}
              />
              <View style={styles.courseNameWrap}>
                <Text
                  style={[styles.courseName, completed && styles.courseNameCompleted]}
                  numberOfLines={2}
                >
                  {course.name}
                </Text>
                <View style={styles.prereqSlot}>
                  <Text
                    style={[
                      styles.prereqStatus,
                      unmetPrereq ? styles.prereqWarning : styles.prereqStatusHidden,
                    ]}
                    numberOfLines={1}
                  >
                    {unmetPrereq ? '△ 선수과목 미이수' : '\u00a0'}
                  </Text>
                </View>
              </View>
              <View style={styles.courseMeta}>
                <Text style={[styles.courseCredits, completed && styles.textMuted]}>
                  {course.credits}학점
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={completed ? colors.textHint : colors.textSecondary}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const DOT_SIZE = 8;
const PREREQ_LINE_HEIGHT = 16;
const COURSE_ROW_MIN_HEIGHT = 56;

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
    flex: 1,
    flexWrap: 'wrap',
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
  pastBadge: {
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#E5E7EB',
  },
  pastBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textHint,
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
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 11,
    minHeight: COURSE_ROW_MIN_HEIGHT,
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
    marginTop: 5,
  },
  courseNameWrap: {
    flex: 1,
    minHeight: 20 + 2 + PREREQ_LINE_HEIGHT,
  },
  courseName: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  courseNameCompleted: {
    color: colors.textHint,
    textDecorationLine: 'line-through',
  },
  prereqSlot: {
    height: PREREQ_LINE_HEIGHT,
    marginTop: 2,
    justifyContent: 'center',
  },
  prereqStatus: {
    fontSize: 11,
    lineHeight: PREREQ_LINE_HEIGHT,
  },
  prereqWarning: {
    color: colors.warningText,
    fontWeight: '500',
  },
  prereqStatusHidden: {
    opacity: 0,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  courseCredits: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  textMuted: {
    color: colors.textHint,
  },
});
