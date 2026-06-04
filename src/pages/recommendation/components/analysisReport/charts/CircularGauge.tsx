import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularGaugeProps {
  size?: number;
  percent: number;
  strokeColor?: string;
  trackColor?: string;
  label?: string;
  subLabel?: string;
  valueColor?: string;
  animate?: boolean;
}

export function CircularGauge({
  size = 100,
  percent,
  strokeColor = '#14B8A6',
  trackColor = '#E5E7EB',
  label,
  subLabel,
  valueColor = '#14B8A6',
  animate = true,
}: CircularGaugeProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const strokeWidth = size >= 80 ? 8 : 7;
  const radius = (size - strokeWidth) / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(animate ? 0 : clamped / 100);

  useEffect(() => {
    progress.value = withTiming(clamped / 100, { duration: animate ? 1200 : 0 });
  }, [clamped, progress, animate]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </Svg>
      <View style={styles.center}>
        {label ? (
          <Text style={[styles.value, { fontSize: size >= 80 ? 20 : 16, color: valueColor }]}>
            {label}
          </Text>
        ) : (
          <Text style={[styles.value, { fontSize: size >= 80 ? 20 : 16, color: valueColor }]}>
            {clamped}%
          </Text>
        )}
        {subLabel ? <Text style={styles.sub}>{subLabel}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontWeight: '800',
  },
  sub: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
