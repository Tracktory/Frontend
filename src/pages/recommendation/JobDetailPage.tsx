import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import type { MainStackParamList } from '../../navigation/MainStackNavigator';
import { useJobDetailViewModel } from '../../hooks/useJobDetailViewModel';
import { JobDetailSkillSection } from './components/JobDetailSkillSection';
import { JobDetailTrackCard } from './components/JobDetailTrackCard';
import { colors } from '../../styles/colors';

type Props = StackScreenProps<MainStackParamList, 'JobDetail'>;

export function JobDetailPage({ route, navigation }: Props) {
  const { jobId } = route.params;
  const { detail } = useJobDetailViewModel(jobId);

  if (!detail) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>직무 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>직무 상세</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 타이틀 영역 */}
        <View style={styles.titleSection}>
          <Text style={styles.jobTitle}>{detail.title}</Text>
          {detail.matchScore > 0 && (
            <View style={styles.matchRow}>
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>매칭도 {detail.matchScore}%</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {detail.reasoning.trim().length > 0 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>추천 이유</Text>
              <Text style={styles.descriptionText}>{detail.reasoning}</Text>
            </View>
            <View style={styles.divider} />
          </>
        )}

        {detail.detailedDescription.trim().length > 0 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>직무 설명</Text>
              <Text style={styles.descriptionText}>{detail.detailedDescription}</Text>
            </View>
            <View style={styles.divider} />
          </>
        )}

        {detail.coreSkills.length > 0 && (
          <>
            <View style={styles.section}>
              <JobDetailSkillSection
                title="필요 역량 (기본)"
                skills={detail.coreSkills}
                variant="core"
              />
            </View>
            <View style={styles.divider} />
          </>
        )}

        {detail.advancedSkills.length > 0 && (
          <>
            <View style={styles.section}>
              <JobDetailSkillSection
                title="필요 역량 (심화)"
                skills={detail.advancedSkills}
                variant="advanced"
              />
            </View>
            <View style={styles.divider} />
          </>
        )}

        {detail.relatedTracks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>관련 트랙</Text>
            {detail.relatedTracks.map((track) => (
              <JobDetailTrackCard
                key={track.name}
                name={track.name}
                description={track.description}
              />
            ))}
          </View>
        )}
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
  jobTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  matchBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  matchText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
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
