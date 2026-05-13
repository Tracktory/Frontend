import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import type { MainStackParamList } from '../../navigation/MainStackNavigator';
import { useCourseDetailViewModel } from '../../hooks/useCourseDetailViewModel';
import { CourseDetailRelatedJobList } from './components/CourseDetailRelatedJobList';
import { colors } from '../../styles/colors';

type Props = StackScreenProps<MainStackParamList, 'CourseDetail'>;

const STAGE_COLORS: Record<1 | 2 | 3 | 4, string> = {
  1: colors.stageBasic,
  2: colors.stageCore,
  3: colors.stageApplied,
  4: colors.stageCap,
};

export function CourseDetailPage({ route, navigation }: Props) {
  const { courseId } = route.params;
  const { detail } = useCourseDetailViewModel(courseId);

  if (!detail) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>과목 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const stageColor = STAGE_COLORS[detail.stageNumber];

  return (
    <View style={styles.screen}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.6 }]}
          onPress={() => navigation.goBack()}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textStrong} />
        </Pressable>
        <Text style={styles.headerTitle}>과목 상세</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 타이틀 영역 */}
        <View style={styles.titleSection}>
          <Text style={styles.courseName}>{detail.name}</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.stageBadge, { backgroundColor: stageColor }]}>
              <Text style={styles.stageBadgeText}>
                {detail.stageNumber}단계: {detail.stageLabel}
              </Text>
            </View>
            <View style={[styles.priorityBadge, { borderColor: stageColor }]}>
              <Text style={[styles.priorityBadgeText, { color: stageColor }]}>
                {detail.priority}순위
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* 과목 설명 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>과목 설명</Text>
          <Text style={styles.descriptionText}>{detail.detailedDescription}</Text>
        </View>

        <View style={styles.divider} />

        {/* 관련 직무 */}
        <View style={styles.section}>
          <CourseDetailRelatedJobList jobs={detail.relatedJobs} />
        </View>

        {/* 선수과목 안내 */}
        {detail.prerequisiteUnmet ? (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>선수과목 안내</Text>
              <View style={styles.prereqCard}>
                <Ionicons name="warning-outline" size={16} color={colors.warningText} />
                <Text style={styles.prereqText}>
                  선수과목 <Text style={styles.prereqBold}>{detail.prerequisiteUnmet}</Text>을(를)
                  아직 이수하지 않았습니다. 해당 과목 수강 후 이 과목을 수강하는 것을 권장합니다.
                </Text>
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: colors.textStrong,
  },
  headerRight: {
    width: 36,
  },
  scrollArea: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  courseName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 14,
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  stageBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  stageBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
  priorityBadge: {
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  priorityBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: 20,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textStrong,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  prereqCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.warningBackground,
    borderRadius: 10,
    padding: 14,
  },
  prereqText: {
    flex: 1,
    fontSize: 13,
    color: colors.warningText,
    lineHeight: 20,
  },
  prereqBold: {
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
