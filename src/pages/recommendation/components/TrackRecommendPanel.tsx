import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { TrackRecommendPayload } from '../../../data/mockTrackRecommendData';
import { colors } from '../../../styles/colors';
import { JobCard } from './JobCard';
import { SecondaryTrackList } from './SecondaryTrackList';

/** 주 추천 트랙 제목 앞에 붙는 순위 메달 */
const MEDAL: Record<1 | 2, string> = {
  1: '🥇',
  2: '🥈',
};

interface TrackRecommendPanelProps {
  data: TrackRecommendPayload;
}

export function TrackRecommendPanel({ data }: TrackRecommendPanelProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>주 추천 트랙</Text>
      {data.primary.map((track) => (
        <JobCard
          key={track.rank}
          mode="track"
          title={`${MEDAL[track.rank]} ${track.title}`}
          description={track.coreSubjects}
          chips={track.relatedJobs}
          emphasized
        />
      ))}

      <Text style={[styles.sectionTitle, styles.sectionSpacer]}>보조 추천 트랙 (5개)</Text>
      <SecondaryTrackList tracks={data.secondary} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 10,
  },
  sectionSpacer: {
    marginTop: 8,
  },
});
