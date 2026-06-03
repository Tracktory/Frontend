import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export interface BriefingItem {
  job: string;
  headline: string;
  summary: string;
  source: string;
}

const FIRST_YEAR_BRIEFINGS: BriefingItem[] = [
  {
    job: 'Data Scientist',
    headline: 'AI 모델 해석 가능성이 핵심 이슈로 부상',
    summary:
      'XAI(설명 가능한 AI) 기술이 금융·의료 분야에서 필수 요건이 되고 있습니다. SHAP, LIME 등 모델 해석 도구 활용 능력이 중요해지는 추세입니다.',
    source: 'Kaggle Survey · 2026',
  },
  {
    job: 'Backend Developer',
    headline: '서버리스 아키텍처 채택 급증',
    summary:
      'AWS Lambda, Vercel Edge Functions 등 서버리스 플랫폼이 빠르게 확산. 이벤트 기반 설계와 분산 시스템 이해가 필수 역량으로 자리잡고 있습니다.',
    source: 'Stack Overflow · 2026',
  },
  {
    job: 'UX Researcher',
    headline: '행동 데이터 기반 리서치 방법론 주목',
    summary:
      '정성 조사와 정량 데이터 결합이 핵심. Amplitude, Mixpanel 등 분석 도구를 활용한 데이터 드리븐 UX 설계가 트렌드입니다.',
    source: 'Nielsen Norman Group · 2026',
  },
];

const CLIMBING_BRIEFINGS: BriefingItem[] = [
  {
    job: 'Backend',
    headline: 'Kafka 기반 이벤트 스트리밍 수요 증가',
    summary:
      '대규모 실시간 데이터 처리에서 Kafka의 역할이 확대. MSA 환경에서 이벤트 소싱 패턴 적용이 표준화되고 있습니다.',
    source: 'JetBrains Survey · 2026',
  },
  {
    job: 'Data Eng',
    headline: 'dbt + Snowflake 조합이 데이터 파이프라인 표준으로',
    summary:
      '데이터 변환 계층을 코드로 관리하는 dbt가 빠르게 확산. SQL 기반 데이터 모델링과 버전 관리가 핵심 스킬로 부상했습니다.',
    source: 'Data Council · 2026',
  },
  {
    job: 'AI',
    headline: 'LLM 파인튜닝보다 RAG 아키텍처 선호',
    summary:
      '비용 효율적인 RAG(검색 증강 생성) 패턴이 주류로. 벡터 DB(Pinecone, Weaviate)와 임베딩 최적화 능력이 실무 핵심이 되고 있습니다.',
    source: 'arXiv · 2026',
  },
];

interface JourneyAIBriefingSheetProps {
  isFirstYear: boolean;
}

function BriefingTrendCard({ item }: { item: BriefingItem }) {
  return (
    <View style={styles.trendCard}>
      <View style={styles.jobPill}>
        <Text style={styles.jobPillText}>{item.job}</Text>
      </View>
      <Text style={styles.headline}>{item.headline}</Text>
      <Text style={styles.summary}>{item.summary}</Text>
      <Text style={styles.source}>{item.source}</Text>
    </View>
  );
}

export function JourneyAIBriefingSheet({ isFirstYear }: JourneyAIBriefingSheetProps) {
  const briefings = isFirstYear ? FIRST_YEAR_BRIEFINGS : CLIMBING_BRIEFINGS;
  const intro = isFirstYear
    ? '관심사 기반 추천 직무의 최신 트렌드를 확인해보세요.'
    : '선택한 직무 분야의 최신 트렌드와 필수 기술을 정리했어요.';

  return (
    <View style={styles.wrap}>
      <Text style={styles.intro}>{intro}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {briefings.map((item) => (
          <BriefingTrendCard key={item.job + item.headline} item={item} />
        ))}
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
  scrollContent: {
    gap: 16,
    paddingRight: 8,
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
});
