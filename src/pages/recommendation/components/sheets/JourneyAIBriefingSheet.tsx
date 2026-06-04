import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { useAIBriefing } from '../../../../hooks/useAIBriefing';
import type { BriefingItem } from '../../data/briefingMockData';

export type { BriefingItem };

interface JourneyAIBriefingSheetProps {
  isFirstYear: boolean;
  enabled?: boolean;
}

function BriefingTrendCard({ item, index }: { item: BriefingItem; index: number }) {
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).duration(350)}
      style={styles.trendCard}
    >
      <View style={styles.jobPill}>
        <Text style={styles.jobPillText}>{item.job}</Text>
      </View>
      <Text style={styles.headline}>{item.headline}</Text>
      <Text style={styles.summary}>{item.summary}</Text>
      <Text style={styles.source}>{item.source}</Text>
    </Animated.View>
  );
}

export function JourneyAIBriefingSheet({
  isFirstYear,
  enabled = true,
}: JourneyAIBriefingSheetProps) {
  const { cards, isLoading, isStreaming } = useAIBriefing({
    isFirstYear,
    enabled,
  });

  const intro = isFirstYear
    ? '관심사 기반 추천 직무의 최신 트렌드를 확인해보세요.'
    : '선택한 직무 분야의 최신 트렌드와 필수 기술을 정리했어요.';

  return (
    <View style={styles.wrap}>
      <Text style={styles.intro}>{intro}</Text>
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
          <BriefingTrendCard key={`${item.job}-${item.headline}`} item={item} index={index} />
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
    color: '#9CA3AF',
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
