import React from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { useAIBriefing, type BriefingCard } from '../../../../hooks/useAIBriefing';
import type { BriefingSource } from '../../../../api/briefingApi';

export type { BriefingCard };

interface JourneyAIBriefingSheetProps {
  isFirstYear: boolean;
  accessToken: string | null;
  enabled?: boolean;
}

const MAX_SKILL_CHIPS = 6;

function formatSourceLabel(source: BriefingSource): string {
  if (source.publishedAt) {
    return `${source.title} · ${source.publishedAt}`;
  }
  return source.title;
}

function BriefingTrendCard({ item, index }: { item: BriefingCard; index: number }) {
  const skills = item.skills.slice(0, MAX_SKILL_CHIPS);
  const sources = item.sources.slice(0, 2);

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).duration(350)}
      style={styles.trendCard}
    >
      <View style={styles.jobPill}>
        <Text style={styles.jobPillText}>{item.job}</Text>
      </View>
      {skills.length > 0 ? (
        <View style={styles.skillsRow}>
          {skills.map((skill) => (
            <View key={skill} style={styles.skillChip}>
              <Text style={styles.skillChipText}>{skill}</Text>
            </View>
          ))}
        </View>
      ) : null}
      <Text style={styles.headline}>{item.headline}</Text>
      <Text style={styles.summary}>{item.summary}</Text>
      {sources.map((source) => (
        <Pressable
          key={`${source.url}-${source.title}`}
          onPress={() => Linking.openURL(source.url)}
          accessibilityRole="link"
        >
          <Text style={styles.source}>{formatSourceLabel(source)}</Text>
        </Pressable>
      ))}
    </Animated.View>
  );
}

export function JourneyAIBriefingSheet({
  isFirstYear,
  accessToken,
  enabled = true,
}: JourneyAIBriefingSheetProps) {
  const { cards, isLoading, isStreaming, errorMessage, isEmpty, retry } = useAIBriefing({
    accessToken,
    enabled,
  });

  const intro = isFirstYear
    ? '관심사 기반 추천 직무의 최신 트렌드를 확인해보세요.'
    : '선택한 직무 분야의 최신 트렌드와 필수 기술을 정리했어요.';

  return (
    <View style={styles.wrap}>
      <Text style={styles.intro}>{intro}</Text>
      {errorMessage ? (
        <View style={styles.errorBlock}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Pressable style={styles.retryButton} onPress={retry}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </Pressable>
        </View>
      ) : null}
      {!errorMessage && isEmpty && !isLoading ? (
        <Text style={styles.emptyText}>
          현재 추천 직무에 대한 트렌드 브리핑이 준비되지 않았어요.
        </Text>
      ) : null}
      {isLoading ? (
        <View style={styles.loadingRow}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.skeletonCard} />
          ))}
        </View>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cards.map((item, index) => (
          <BriefingTrendCard
            key={`${item.code}-${item.headline}`}
            item={item}
            index={index}
          />
        ))}
        {isStreaming ? <View style={styles.streamingDot} /> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 8,
  },
  intro: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 21,
    marginBottom: 20,
  },
  errorBlock: {
    marginBottom: 16,
    gap: 10,
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    lineHeight: 20,
  },
  retryButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  retryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D9488',
  },
  emptyText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  loadingRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  skeletonCard: {
    width: 300,
    height: 160,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    opacity: 0.7,
  },
  scrollContent: {
    gap: 16,
    paddingRight: 8,
    alignItems: 'center',
  },
  trendCard: {
    width: 300,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    padding: 20,
  },
  jobPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#CCFBF1',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  jobPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  skillChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  skillChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4B5563',
  },
  headline: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 22,
    marginBottom: 8,
  },
  summary: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  source: {
    fontSize: 11,
    color: '#0D9488',
    marginBottom: 4,
  },
  streamingDot: {
    width: 48,
    height: 160,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#99F6E4',
    marginLeft: 4,
  },
});
