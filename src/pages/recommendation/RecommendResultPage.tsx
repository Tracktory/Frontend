import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { useRecommendResultViewModel } from '../../hooks/useRecommendResultViewModel';
import { useRecommendStore } from '../../stores/recommendStore';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useProfileStore } from '../../stores/profileStore';
import { useAuthStore } from '../../stores/authStore';
import { SegmentTab } from './components/SegmentTab';
import { JobCard } from './components/JobCard';
import { TrackRecommendPanel } from './components/TrackRecommendPanel';
import { RoadmapPanel } from './components/RoadmapPanel';
import { printAndShareRecommendPdfFromOptions } from '../../utils/printRecommendPdf';
import type { MainStackParamList } from '../../navigation/MainStackNavigator';

export function RecommendResultPage() {
  const vm = useRecommendResultViewModel();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const recommendResult = useRecommendStore((s) => s.result);
  const completedCourses = useOnboardingStore((s) => s.completedCourses);
  const grade = useOnboardingStore((s) => s.grade);
  const profile = useProfileStore((s) => s.profile);
  const userName = useAuthStore((s) => s.userName);
  const profileCurrentYear = profile?.profile.currentYear;
  const studentGrade = profileCurrentYear ?? grade;

  const handleSavePdf = async () => {
    if (vm.isError) return;

    if (!recommendResult) {
      Alert.alert('알림', '저장할 추천 결과가 없습니다.');
      return;
    }

    try {
      await printAndShareRecommendPdfFromOptions({
        jobs: recommendResult.jobs,
        trackRecommend: recommendResult.trackRecommend,
        roadmap: recommendResult.roadmap,
        completedCourses,
        studentGrade,
        studentName: profile?.profile.name ?? userName ?? undefined,
        generatedAt: new Date().toISOString(),
      });
    } catch {
      Alert.alert('저장 실패', '다시 시도해주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>나의 추천 결과</Text>
          <View style={styles.headerIcons}>
            {/* 새로고침 */}
            <Pressable
              style={styles.iconBtn}
              onPress={vm.refresh}
              hitSlop={8}
              accessibilityLabel="새로고침"
            >
              <Ionicons name="refresh" size={20} color={colors.textSecondary} />
            </Pressable>
            {/* PDF 저장 */}
            <Pressable
              style={styles.iconBtn}
              onPress={handleSavePdf}
              disabled={vm.isError}
              hitSlop={8}
              accessibilityLabel="PDF 저장"
            >
              <Ionicons
                name="download-outline"
                size={20}
                color={vm.isError ? colors.textHint : colors.textSecondary}
              />
            </Pressable>
          </View>
        </View>

        {/* 전체 에러 UI */}
        {vm.isError && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={colors.textHint} />
            <Text style={styles.errorText}>추천 결과를 불러오지 못했습니다</Text>
            <Pressable style={styles.retryButton} onPress={vm.refresh}>
              <Text style={styles.retryButtonText}>재시도</Text>
            </Pressable>
          </View>
        )}

        {/* 정상 콘텐츠 */}
        {!vm.isError && (
          <View style={styles.flex}>
            <SegmentTab activeTab={vm.activeTab} onTabChange={vm.setActiveTab} />

            {vm.activeTab === 'job' && (
              <>
                {vm.hasJobData ? (
                  <ScrollView
                    style={styles.scrollArea}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                  >
                    {vm.jobs.map((job) => (
                      <JobCard
                        key={job.id}
                        title={job.title}
                        description={job.description}
                        reasoning={job.reasoning}
                        titleTrailing={job.matchScore > 0 ? `${job.matchScore}%` : undefined}
                        chips={job.techStack}
                        chipsReady={job.techStackReady}
                        onPress={() => vm.handleSelectJob(navigation, job.id)}
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
              <>
                {vm.trackRecommend ? (
                  <ScrollView
                    style={styles.scrollArea}
                    contentContainerStyle={styles.trackScrollContent}
                    showsVerticalScrollIndicator={false}
                  >
                    <TrackRecommendPanel data={vm.trackRecommend} />
                  </ScrollView>
                ) : null}
              </>
            )}

            {vm.activeTab === 'roadmap' && (
              <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.roadmapScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <RoadmapPanel
                  roadmap={vm.roadmap}
                  isLoading={false}
                  isError={vm.isError}
                  onRetry={vm.refresh}
                />
              </ScrollView>
            )}
          </View>
        )}
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
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    padding: 6,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 60,
  },
  errorText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  retryButton: {
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 28,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  scrollArea: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 12,
  },
  trackScrollContent: {
    paddingBottom: 12,
  },
  roadmapScrollContent: {
    paddingBottom: 24,
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
});
