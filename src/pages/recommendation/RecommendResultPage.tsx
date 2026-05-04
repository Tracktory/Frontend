import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../styles/colors';
import { useRecommendResultViewModel } from '../../hooks/useRecommendResultViewModel';
import { SegmentTab } from './components/SegmentTab';
import { JobCard } from './components/JobCard';

export function RecommendResultPage() {
  const vm = useRecommendResultViewModel();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>나의 추천 결과</Text>
        </View>

        <SegmentTab activeTab={vm.activeTab} onTabChange={vm.setActiveTab} />

        {vm.activeTab === 'job' && (
          <>
            {vm.hasData ? (
              <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              >
                {vm.jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    selected={vm.selectedJobId === job.id}
                    onPress={() => vm.handleSelectJob(job.id)}
                  />
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>데이터 추가 예정입니다</Text>
                <Text style={styles.emptySubText}>곧 직무 추천 데이터가 업데이트됩니다</Text>
              </View>
            )}
          </>
        )}

        {vm.activeTab === 'track' && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {vm.selectedJobId
                ? '해당 직무 기준 트랙 추천 준비 중'
                : '직무추천 탭에서 직무를 먼저 선택해주세요'}
            </Text>
            <Text style={styles.emptySubText}>데이터 추가 예정입니다</Text>
          </View>
        )}

        {vm.activeTab === 'roadmap' && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>학습 로드맵</Text>
            <Text style={styles.emptySubText}>데이터 추가 예정입니다</Text>
          </View>
        )}

        <View style={styles.bottomArea}>
          <Pressable style={styles.detailButton} disabled>
            <Text style={styles.detailButtonText}>[P2] HM-007 기술스택 상세보기</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scrollArea: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 13,
    color: colors.textHint,
  },
  bottomArea: {
    paddingTop: 12,
  },
  detailButton: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  detailButtonText: {
    fontSize: 14,
    color: colors.textHint,
    fontWeight: '500',
  },
});
