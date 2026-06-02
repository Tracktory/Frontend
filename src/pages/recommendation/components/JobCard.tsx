import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../styles/colors';

export interface JobCardProps {
  title: string;
  description: string;
  /** 추천 근거 (description과 별개). 있을 때만 표시 */
  reasoning?: string;
  /** 제목 행 오른쪽 보조 텍스트 (예: 적합도 `92%`). 점수가 없으면 생략. */
  titleTrailing?: string;
  chips: string[];
  /**
   * false면 `chips`를 그리지 않고 "수집 중" 배지만 표시.
   * 기본값 true.
   */
  chipsReady?: boolean;
  /** 직무 탭에서 카드 선택 시 강조 스타일 */
  selected?: boolean;
  onPress?: () => void;
  /**
   * `job`: 눌러 선택 가능한 목록 카드(기본).
   * `track`: 비인터랙티브 카드; `emphasized`로 강조/무디드 스타일 구분.
   */
  mode?: 'job' | 'track';
  /** `mode === 'track'`일 때: true면 프라이머리 테두리·배경, false면 회색 톤 카드 */
  emphasized?: boolean;
}

export function JobCard({
  title,
  description,
  reasoning,
  titleTrailing,
  chips,
  chipsReady = true,
  selected = false,
  onPress,
  mode = 'job',
  emphasized = true,
}: JobCardProps) {
  const isTrack = mode === 'track';
  const showChips = chipsReady;
  const showCollecting = !chipsReady;
  const hasDescription = description.trim().length > 0;
  const hasReasoning = (reasoning?.trim().length ?? 0) > 0;
  const hasChipRow = showCollecting || (showChips && chips.length > 0);

  const cardStyle = [
    styles.card,
    isTrack &&
      !hasChipRow &&
      !hasDescription &&
      (emphasized ? styles.cardTrackTitleOnly : styles.cardTrackTitleOnlyMuted),
    isTrack
      ? emphasized
        ? styles.cardTrackEmphasized
        : styles.cardTrackMuted
      : selected && styles.cardSelected,
  ];

  const header = (
    <View style={[styles.header, !hasChipRow && styles.headerNoFooter]}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {titleTrailing != null && titleTrailing !== '' ? (
          <Text style={styles.matchScore}>{titleTrailing}</Text>
        ) : null}
      </View>
      {hasDescription ? <Text style={styles.description}>{description}</Text> : null}
      {hasReasoning ? (
        <Text style={styles.reasoning}>추천 이유: {reasoning}</Text>
      ) : null}
    </View>
  );

  const footer = hasChipRow ? (
    <View style={styles.techRow}>
      {showChips
        ? chips.map((chip) => (
            <View key={chip} style={styles.techChip}>
              <Text style={styles.techChipText}>{chip}</Text>
            </View>
          ))
        : null}
      {showCollecting ? (
        <View style={styles.collectingBadge}>
          <Text style={styles.collectingText}>수집 중</Text>
        </View>
      ) : null}
    </View>
  ) : null;

  // 직무 탭: 탭 선택·터치 피드백을 위해 Pressable 사용
  if (!isTrack && onPress) {
    return (
      <Pressable
        style={({ pressed }) => [cardStyle, pressed && styles.cardPressed]}
        onPress={onPress}
      >
        {header}
        {footer}
      </Pressable>
    );
  }

  // 트랙 탭 등: 읽기 전용 정적 카드(Pressable 없음 → 버튼 느낌 완화)
  return (
    <View style={cardStyle}>
      {header}
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTrackTitleOnly: {
    paddingVertical: 16,
  },
  /** 보조 추천 등: 제목만 있는 무디드 트랙 — 세로 패딩만 살짝 타이트 */
  cardTrackTitleOnlyMuted: {
    paddingVertical: 12,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    shadowOpacity: 0.1,
  },
  cardTrackEmphasized: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    shadowOpacity: 0.1,
  },
  cardTrackMuted: {
    backgroundColor: colors.inputSurface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  cardPressed: {
    opacity: 0.94,
  },
  header: {
    marginBottom: 14,
  },
  headerNoFooter: {
    marginBottom: 0,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: 12,
  },
  matchScore: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  reasoning: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textHint,
    lineHeight: 18,
  },
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 10,
  },
  techChip: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  techChipText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  collectingBadge: {
    backgroundColor: colors.warningBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  collectingText: {
    fontSize: 12,
    color: colors.warningText,
    fontWeight: '500',
  },
});
