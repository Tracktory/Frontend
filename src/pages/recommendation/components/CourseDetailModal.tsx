import React, { useMemo } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../../styles/colors';
import { MOCK_ROADMAP } from '../../../data/mockRoadmapData';
import type { SemesterCourse, SemesterStep } from '../../../data/mockRoadmapData';
import { useOnboardingStore } from '../../../stores/onboardingStore';

const STAGE_COLORS: Record<1 | 2 | 3 | 4, string> = {
  1: colors.stageBasic,
  2: colors.stageCore,
  3: colors.stageApplied,
  4: colors.stageCap,
};

interface CourseDetailModalProps {
  courseId: string | null;
  onClose: () => void;
}

interface ResolvedCourse {
  course: SemesterCourse;
  step: SemesterStep;
}

function findCourse(courseId: string): ResolvedCourse | null {
  for (const step of MOCK_ROADMAP.semesterSteps) {
    const course = step.courses.find((c) => c.id === courseId);
    if (course) return { course, step };
  }
  return null;
}

export function CourseDetailModal({ courseId, onClose }: CourseDetailModalProps) {
  const insets = useSafeAreaInsets();
  const completedCourses = useOnboardingStore((s) => s.completedCourses);

  const resolved = useMemo(
    () => (courseId ? findCourse(courseId) : null),
    [courseId]
  );

  const isCompleted = resolved
    ? completedCourses.includes(resolved.course.name)
    : false;

  const stageColor = resolved ? STAGE_COLORS[resolved.step.stageNumber] : colors.primary;

  return (
    <Modal
      visible={courseId !== null}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          {/* 핸들 */}
          <View style={styles.handle} />

          {/* 헤더 */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {resolved && (
                <View style={[styles.stageBadge, { backgroundColor: `${stageColor}22` }]}>
                  <Text style={[styles.stageBadgeText, { color: stageColor }]}>
                    {resolved.step.stageLabel}
                  </Text>
                </View>
              )}
              <Text style={styles.courseName}>{resolved?.course.name ?? ''}</Text>
            </View>
            <Pressable hitSlop={12} onPress={onClose} accessibilityLabel="닫기">
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {resolved && (
              <>
                {/* 메타 정보 행 */}
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>학년 / 학기</Text>
                    <Text style={styles.metaValue}>
                      {resolved.step.year}학년 {resolved.step.semester}학기
                    </Text>
                  </View>
                  <View style={styles.metaDivider} />
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>학점</Text>
                    <Text style={styles.metaValue}>{resolved.course.credits}학점</Text>
                  </View>
                  <View style={styles.metaDivider} />
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>이수 여부</Text>
                    <View style={styles.statusRow}>
                      <View style={[styles.statusDot, { backgroundColor: isCompleted ? colors.stageBasic : colors.textHint }]} />
                      <Text style={[styles.metaValue, { color: isCompleted ? colors.stageBasic : colors.textHint }]}>
                        {isCompleted ? '이수 완료' : '미이수'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* 과목 설명 */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>과목 설명</Text>
                  <Text style={styles.sectionBody}>{resolved.course.description}</Text>
                </View>

                {/* 관련 트랙 */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>해당 단계</Text>
                  <View style={styles.tagRow}>
                    <View style={[styles.tag, { borderColor: stageColor, backgroundColor: `${stageColor}15` }]}>
                      <Text style={[styles.tagText, { color: stageColor }]}>
                        {resolved.step.stageLabel} 단계
                      </Text>
                    </View>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>
                        {resolved.step.year}학년 {resolved.step.semester}학기
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const STATUS_DOT_SIZE = 7;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 8,
    maxHeight: '70%',
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
    gap: 6,
  },
  stageBadge: {
    alignSelf: 'flex-start',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  stageBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  courseName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingRight: 12,
  },
  scroll: {
    flexGrow: 0,
  },
  metaRow: {
    flexDirection: 'row',
    backgroundColor: colors.inputSurface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  metaDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  metaLabel: {
    fontSize: 11,
    color: colors.textHint,
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: STATUS_DOT_SIZE,
    height: STATUS_DOT_SIZE,
    borderRadius: STATUS_DOT_SIZE / 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionBody: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: colors.inputSurface,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
