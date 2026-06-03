import React, { useMemo } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import type { RoadmapPayload } from '../../../data/mockRoadmapData';
import type { JobRecommendation } from '../../../data/mockRecommendData';
import { computeCompetencyFromRoadmap } from '../utils/journeyCompetency';

interface JourneyAnalysisReportModalProps {
  visible: boolean;
  onClose: () => void;
  roadmap: RoadmapPayload | null;
  completedCourses: string[];
  jobs: JobRecommendation[];
}

export function JourneyAnalysisReportModal({
  visible,
  onClose,
  roadmap,
  completedCourses,
  jobs,
}: JourneyAnalysisReportModalProps) {
  const stats = useMemo(
    () => computeCompetencyFromRoadmap(roadmap, completedCourses),
    [roadmap, completedCourses],
  );

  const topJobs = jobs.slice(0, 3);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={12} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </Pressable>
          <Text style={styles.headerTitle}>상세 분석 리포트</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroCard}>
            <Text style={styles.heroLabel}>역량 커버리지</Text>
            <Text style={styles.heroValue}>
              {stats.currentPercent}% → {stats.targetPercent}%
            </Text>
            <Text style={styles.heroSub}>
              잔여 {stats.remainingCount}개 과목 완료 시 목표 달성
            </Text>
          </View>

          {topJobs.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>직무 매칭 요약</Text>
              {topJobs.map((job) => (
                <View key={job.id} style={styles.jobRow}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  {job.matchScore > 0 ? (
                    <Text style={styles.jobMatch}>{job.matchScore}% 매칭</Text>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}

          {stats.remainingCourses.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>핵심 잔여 과목</Text>
              {stats.remainingCourses.map((c) => (
                <Text key={c.name} style={styles.bullet}>
                  · {c.name} ({c.gainLabel})
                </Text>
              ))}
            </View>
          ) : null}

          <Text style={styles.footerNote}>
            레이더 차트·학기별 플랜 등 상세 시각화는 추후 업데이트됩니다.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  heroCard: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  heroLabel: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 8,
  },
  heroValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#14B8A6',
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  jobRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  jobMatch: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D9488',
  },
  bullet: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 4,
  },
  footerNote: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
});
