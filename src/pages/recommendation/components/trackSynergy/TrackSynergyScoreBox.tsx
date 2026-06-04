import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface TrackSynergyScoreBoxProps {
  score?: number;
  subtitle: string;
}

export function TrackSynergyScoreBox({ score, subtitle }: TrackSynergyScoreBoxProps) {
  const clamped = Math.min(100, Math.max(0, score ?? 0));
  const [trackWidth, setTrackWidth] = useState(0);
  const fillWidth = useSharedValue(0);

  useEffect(() => {
    if (trackWidth <= 0) return;
    fillWidth.value = withDelay(
      200,
      withTiming((trackWidth * clamped) / 100, { duration: 1000 }),
    );
  }, [clamped, trackWidth, fillWidth]);

  const fillStyle = useAnimatedStyle(() => ({
    width: fillWidth.value,
  }));

  const onTrackLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setTrackWidth(w);
  };

  return (
    <View style={styles.box}>
      <Text style={styles.scoreTitle}>
        Synergy Score {score != null ? score : '—'}
      </Text>
      <Text style={styles.scoreSub}>{subtitle}</Text>
      <View style={styles.gaugeTrack} onLayout={onTrackLayout}>
        <Animated.View style={[styles.gaugeFill, fillStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#CCFBF1',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D9488',
    marginBottom: 4,
  },
  scoreSub: {
    fontSize: 13,
    color: '#0F766E',
    marginBottom: 12,
  },
  gaugeTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  gaugeFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#14B8A6',
  },
});
