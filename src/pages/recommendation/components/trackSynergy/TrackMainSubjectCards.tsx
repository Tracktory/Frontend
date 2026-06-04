import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import type { TrackSubjectRef } from '../../../../data/mockTrackRecommendData';
import { colors } from '../../../../styles/colors';

const CARD_WIDTH = 132;
const CARD_GAP = 8;
const PX_PER_SECOND = 30;

interface TrackMainSubjectCardsProps {
  subjects: TrackSubjectRef[];
}

function SubjectCard({ subject }: { subject: TrackSubjectRef }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name} numberOfLines={2}>
        {subject.name}
      </Text>
    </View>
  );
}

export function TrackMainSubjectCards({ subjects }: TrackMainSubjectCardsProps) {
  const translateX = useSharedValue(0);

  const loopSubjects = useMemo(() => {
    if (subjects.length === 0) return [];
    return [...subjects, ...subjects];
  }, [subjects]);

  const segmentWidth = subjects.length * (CARD_WIDTH + CARD_GAP);

  useEffect(() => {
    if (subjects.length === 0 || segmentWidth <= 0) return;

    translateX.value = 0;
    const durationMs = Math.max(6000, (segmentWidth / PX_PER_SECOND) * 1000);

    translateX.value = withRepeat(
      withTiming(-segmentWidth, {
        duration: durationMs,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    return () => {
      cancelAnimation(translateX);
    };
  }, [subjects, segmentWidth, translateX]);

  const stripStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (subjects.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>주요 과목</Text>
      <View style={styles.viewport}>
        <Animated.View style={[styles.strip, stripStyle]}>
          {loopSubjects.map((subject, index) => (
            <SubjectCard
              key={`${subject.name}-${index}`}
              subject={subject}
            />
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  viewport: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  strip: {
    flexDirection: 'row',
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 18,
  },
});
