import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

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
        )}

        {vm.activeTab === 'roadmap' && (
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.roadmapScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <RoadmapPanel
              roadmap={vm.roadmap}
              isLoading={vm.roadmapLoading}
              isError={vm.roadmapError}
              onRetry={vm.retryRoadmap}
              onPressCourse={(courseId) => navigation.navigate('CourseDetail', { courseId })}
            />
          </ScrollView>
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
