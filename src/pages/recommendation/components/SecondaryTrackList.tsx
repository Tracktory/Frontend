import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { SecondaryTrack } from '../../../data/mockTrackRecommendData';
import { JobCard } from './JobCard';

interface SecondaryTrackListProps {
  tracks: SecondaryTrack[];
}

/** 주 트랙과 동일한 카드 레이아웃이지만 강조(프라이머리 테두리) 없이 무디드 스타일로 표시 */
export function SecondaryTrackList({ tracks }: SecondaryTrackListProps) {
  return (
    <View style={styles.list}>
      {tracks.map((t) => (
        <JobCard
          key={t.id}
          mode="track"
          title={t.name}
          description=""
          chips={[]}
          emphasized={false}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 0,
  },
});
