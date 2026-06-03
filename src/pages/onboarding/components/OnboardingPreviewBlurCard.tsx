import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const MOCK_CHIPS = ['데이터 분석', '머신러닝', 'Python'];

interface OnboardingPreviewBlurCardProps {
  isFirstYear: boolean;
  onOverlayPress: () => void;
}

export function OnboardingPreviewBlurCard({
  isFirstYear,
  onOverlayPress,
}: OnboardingPreviewBlurCardProps) {
  const cardTitle = isFirstYear ? '추천 트랙' : '추천 직무';

  return (
    <View style={styles.card}>
      <View style={styles.blurContent} pointerEvents="none">
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{cardTitle}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>92% 매칭</Text>
          </View>
        </View>

        <View style={styles.chipRow}>
          {MOCK_CHIPS.map((chip) => (
            <View key={chip} style={styles.chip}>
              <Text style={styles.chipText}>{chip}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.body}>
          선택한 관심사와 개발 분야를 바탕으로{'\n'}맞춤 추천 결과를 준비했어요
        </Text>
      </View>

      <View style={styles.blurOverlay} pointerEvents="none" />

      <Pressable style={styles.overlayPill} onPress={onOverlayPress}>
        <Text style={styles.overlayPillText}>전체 결과 보러 가기 👇</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 220,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    backgroundColor: '#FFFFFF',
    padding: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  blurContent: {
    opacity: 0.45,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  badge: {
    backgroundColor: '#CCFBF1',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: '#CCFBF1',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0D9488',
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
    color: '#6B7280',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  overlayPill: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    marginTop: -20,
    backgroundColor: '#14B8A6',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  overlayPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
