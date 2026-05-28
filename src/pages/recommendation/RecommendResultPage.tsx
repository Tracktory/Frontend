import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

import { colors } from '../../styles/colors';
import { useRecommendResultViewModel } from '../../hooks/useRecommendResultViewModel';
import { SegmentTab } from './components/SegmentTab';
import { JobCard } from './components/JobCard';
import { TrackRecommendPanel } from './components/TrackRecommendPanel';
import { LlmSynergySection } from './components/LlmSynergySection';
import { TrackDescriptionSection } from './components/TrackDescriptionSection';
import { RequiredCoursesSection } from './components/RequiredCoursesSection';
import { PrerequisiteSection } from './components/PrerequisiteSection';
import { RoadmapPanel } from './components/RoadmapPanel';
import type { MainStackParamList } from '../../navigation/MainStackNavigator';

export function RecommendResultPage() {
  const vm = useRecommendResultViewModel();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const viewShotRef = useRef<ViewShot>(null);

  const handleSaveImage = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
      return;
    }
    try {
      const uri = await viewShotRef.current!.capture!();
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('저장 완료', '이미지가 갤러리에 저장됐습니다.');
    } catch {
      Alert.alert('저장 실패', '저장에 실패했습니다. 다시 시도해주세요.');
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
              disabled={vm.isLoading}
              hitSlop={8}
              accessibilityLabel="새로고침"
            >
              {vm.isLoading ? (
                <ActivityIndicator size="small" color={colors.textSecondary} />
              ) : (
                <Ionicons name="refresh" size={20} color={colors.textSecondary} />
              )}
            </Pressable>
            {/* 이미지 저장 */}
            <Pressable
              style={styles.iconBtn}
              onPress={handleSaveImage}
              disabled={vm.isLoading || vm.isError}
              hitSlop={8}
              accessibilityLabel="이미지 저장"
            >
              <Ionicons
                name="download-outline"
                size={20}
                color={vm.isLoading || vm.isError ? colors.textHint : colors.textSecondary}
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

        {/* 정상 콘텐츠 — ViewShot으로 감싸 캡처 범위 지정 */}
        {!vm.isError && (
          <ViewShot
            ref={viewShotRef}
            style={styles.flex}
            options={{ format: 'png', quality: 1 }}
            collapsable={false}
          >
            <SegmentTab activeTab={vm.activeTab} onTabChange={vm.setActiveTab} />

            {vm.activeTab === 'job' && (
              <>
                {vm.isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                  </View>
                ) : vm.hasData ? (
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
                        titleTrailing={`${job.matchScore}%`}
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
                {vm.isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                  </View>
                ) : vm.trackRecommend ? (
                  <ScrollView
                    style={styles.scrollArea}
                    contentContainerStyle={styles.trackScrollContent}
                    showsVerticalScrollIndicator={false}
                  >
                    <TrackRecommendPanel data={vm.trackRecommend} />
                    <LlmSynergySection body={vm.trackRecommend.llmSynergy} />
                    <TrackDescriptionSection description={vm.trackRecommend.trackDescription} />
                    <RequiredCoursesSection courses={vm.trackRecommend.requiredCourses} />
                    <PrerequisiteSection note={vm.trackRecommend.prerequisiteNote} />
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
                  isLoading={vm.isLoading}
                  isError={vm.isError}
                  onRetry={vm.refresh}
                />
              </ScrollView>
            )}
          </ViewShot>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
