import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PrimaryTrack } from '../../../../data/mockTrackRecommendData';
import { colors } from '../../../../styles/colors';
import { TrackMainSubjectCards } from './TrackMainSubjectCards';
import { TrackReasoningBlock } from './TrackReasoningBlock';

interface TrackPrimaryItemRowProps {
  track: PrimaryTrack;
  selected: boolean;
  onPress: () => void;
}

export function TrackPrimaryItemRow({
  track,
  selected,
  onPress,
}: TrackPrimaryItemRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrap,
        selected && styles.wrapSelected,
        pressed && styles.wrapPressed,
      ]}
    >
      <View style={styles.row}>
        <Text style={[styles.label, selected && styles.labelSelected]}>{track.title}</Text>
        <View style={[styles.tagPill, selected && styles.tagPillSelected]}>
          <Text style={styles.tagText}>{track.rank === 1 ? 'PRIMARY' : '2ND'}</Text>
        </View>
      </View>

      {selected ? (
        <View style={styles.expanded}>
          <TrackReasoningBlock reasoning={track.reasoning} />
          <TrackMainSubjectCards subjects={track.mainSubjects} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  wrapSelected: {
    backgroundColor: colors.onboardingChipSelectedBg,
    borderColor: colors.primary,
  },
  wrapPressed: {
    opacity: 0.92,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#0D9488',
    marginRight: 12,
  },
  labelSelected: {
    color: colors.primary,
  },
  tagPill: {
    backgroundColor: '#14B8A6',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  tagPillSelected: {
    backgroundColor: colors.primary,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  expanded: {
    marginTop: 4,
    overflow: 'visible',
  },
});
