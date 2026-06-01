import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../styles/colors';

interface TrackCombinationBannerProps {
  score?: number;
  trackNames: string[];
  combinationReasoning: string;
}

export function TrackCombinationBanner({
  score,
  trackNames,
  combinationReasoning,
}: TrackCombinationBannerProps) {
  const trackLabel = trackNames.filter(Boolean).join(' + ');
  const hasScore = score != null;
  const hasTracks = trackLabel.length > 0;
  const hasReasoning = combinationReasoning.trim().length > 0;

  if (!hasScore && !hasTracks && !hasReasoning) return null;

  let headline = '';
  if (hasScore && hasTracks) {
    headline = `시너지 점수 ${score} : ${trackLabel}`;
  } else if (hasScore) {
    headline = `시너지 점수 ${score}`;
  } else if (hasTracks) {
    headline = trackLabel;
  }

  return (
    <View style={styles.banner}>
      {headline !== '' ? <Text style={styles.headline}>{headline}</Text> : null}
      {hasReasoning ? (
        <Text style={styles.reasoning}>선택 이유 : {combinationReasoning}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headline: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    lineHeight: 22,
  },
  reasoning: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
