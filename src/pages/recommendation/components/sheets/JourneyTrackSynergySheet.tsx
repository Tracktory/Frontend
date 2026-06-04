import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { TrackRecommendPayload } from '../../../../data/mockTrackRecommendData';
import { colors } from '../../../../styles/colors';
import { TrackSynergySheetContent } from '../trackSynergy/TrackSynergySheetContent';

interface JourneyTrackSynergySheetProps {
  data: TrackRecommendPayload | null;
}

export function JourneyTrackSynergySheet({ data }: JourneyTrackSynergySheetProps) {
  if (!data) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>트랙 추천 데이터가 없습니다</Text>
      </View>
    );
  }

  return <TrackSynergySheetContent data={data} />;
}

const styles = StyleSheet.create({
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.textHint,
  },
});
