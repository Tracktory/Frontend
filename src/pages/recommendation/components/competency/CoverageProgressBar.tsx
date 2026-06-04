import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

interface CoverageProgressBarProps {
  percent: number;
}

export function CoverageProgressBar({ percent }: CoverageProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
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
    <View style={styles.track} onLayout={onTrackLayout}>
      <Animated.View style={[styles.fillClip, fillStyle]}>
        {trackWidth > 0 ? (
          <Svg width={trackWidth} height={12}>
            <Defs>
              <LinearGradient id="coverageBarGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#14B8A6" />
                <Stop offset="1" stopColor="#2DD4BF" />
              </LinearGradient>
            </Defs>
            <Rect width={trackWidth} height={12} rx={6} fill="url(#coverageBarGrad)" />
          </Svg>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  fillClip: {
    height: 12,
    overflow: 'hidden',
  },
});
