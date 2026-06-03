import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

import { colors } from '../../../styles/colors';
import type { JourneyNodeVisualState } from './JourneyNodeVisuals';
import {
  JOURNEY_GRADIENT_END,
  JOURNEY_GRADIENT_START,
  JOURNEY_LABEL_DEFAULT_BG,
  JOURNEY_LABEL_DEFAULT_TEXT,
  JOURNEY_LABEL_HIGHLIGHT_BG,
  JOURNEY_LABEL_HIGHLIGHT_TEXT,
  JOURNEY_NODE_SIZE,
  JOURNEY_RIPPLE_COLOR,
} from './JourneyNodeVisuals';

const RIPPLE_DURATION = 1400;
const RIPPLE_PAUSE_MS = 1000;
const RIPPLE_MAX_SCALE = 1.75;
const RIPPLE_START_OPACITY = 0.45;

function nodeIcon(name: string): keyof typeof Ionicons.glyphMap {
  const map: Record<string, keyof typeof Ionicons.glyphMap> = {
    flag: 'flag',
    compass: 'compass',
    person: 'person',
    book: 'book',
    'git-network': 'git-network',
  };
  return map[name] ?? 'ellipse';
}

function RippleRing({ delayMs }: { delayMs: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(RIPPLE_START_OPACITY);

  useEffect(() => {
    scale.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(RIPPLE_MAX_SCALE, { duration: RIPPLE_DURATION }),
          withDelay(RIPPLE_PAUSE_MS, withTiming(1, { duration: 0 })),
        ),
        -1,
        false,
      ),
    );
    opacity.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(0, { duration: RIPPLE_DURATION }),
          withDelay(RIPPLE_PAUSE_MS, withTiming(RIPPLE_START_OPACITY, { duration: 0 })),
        ),
        -1,
        false,
      ),
    );
  }, [delayMs, scale, opacity]);

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.pulseRing, rippleStyle]} pointerEvents="none" />
  );
}

function DualRippleRings() {
  return (
    <>
      <RippleRing delayMs={0} />
      <RippleRing delayMs={650} />
    </>
  );
}

interface JourneyNodeButtonProps {
  nodeKey: string;
  visualState: JourneyNodeVisualState;
  label: string;
  nodeColor: string;
  icon?: string;
  emoji?: string;
  onPress: () => void;
}

function GradientCircle({ gradientId }: { gradientId: string }) {
  return (
    <Svg width={JOURNEY_NODE_SIZE} height={JOURNEY_NODE_SIZE}>
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={JOURNEY_GRADIENT_START} />
          <Stop offset="1" stopColor={JOURNEY_GRADIENT_END} />
        </LinearGradient>
      </Defs>
      <Circle
        cx={JOURNEY_NODE_SIZE / 2}
        cy={JOURNEY_NODE_SIZE / 2}
        r={JOURNEY_NODE_SIZE / 2}
        fill={`url(#${gradientId})`}
      />
    </Svg>
  );
}

export function JourneyNodeButton({
  nodeKey,
  visualState,
  label,
  nodeColor,
  icon,
  emoji,
  onPress,
}: JourneyNodeButtonProps) {
  const gradientId = `nodeGrad-${nodeKey}`;
  const isHighlighted = visualState === 'gradient';
  const circleColor = visualState === 'ripple' ? JOURNEY_RIPPLE_COLOR : nodeColor;

  return (
    <Pressable style={styles.wrap} onPress={onPress} accessibilityLabel={label}>
      <View style={styles.circleStack}>
        {visualState === 'ripple' ? <DualRippleRings /> : null}
        <View style={styles.circleClip}>
          {visualState === 'gradient' ? (
            <GradientCircle gradientId={gradientId} />
          ) : (
            <View style={[styles.solidCircle, { backgroundColor: circleColor }]} />
          )}
          {emoji ? (
            <Text style={styles.emoji}>{emoji}</Text>
          ) : icon ? (
            <Ionicons
              name={nodeIcon(icon)}
              size={16}
              color={colors.white}
              style={styles.iconOverlay}
            />
          ) : null}
        </View>
      </View>
      <View
        style={[
          styles.labelPill,
          {
            backgroundColor: isHighlighted
              ? JOURNEY_LABEL_HIGHLIGHT_BG
              : JOURNEY_LABEL_DEFAULT_BG,
          },
        ]}
      >
        <Text
          style={[
            styles.labelText,
            {
              color: isHighlighted
                ? JOURNEY_LABEL_HIGHLIGHT_TEXT
                : JOURNEY_LABEL_DEFAULT_TEXT,
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    minWidth: JOURNEY_NODE_SIZE,
  },
  circleStack: {
    width: JOURNEY_NODE_SIZE,
    height: JOURNEY_NODE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleClip: {
    width: JOURNEY_NODE_SIZE,
    height: JOURNEY_NODE_SIZE,
    borderRadius: JOURNEY_NODE_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  solidCircle: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: JOURNEY_NODE_SIZE / 2,
  },
  emoji: {
    position: 'absolute',
    fontSize: 16,
    lineHeight: 22,
  },
  iconOverlay: {
    position: 'absolute',
  },
  pulseRing: {
    position: 'absolute',
    top: 0,
    width: JOURNEY_NODE_SIZE,
    height: JOURNEY_NODE_SIZE,
    borderRadius: JOURNEY_NODE_SIZE / 2,
    borderWidth: 2,
    borderColor: JOURNEY_RIPPLE_COLOR,
  },
  labelPill: {
    marginTop: 6,
    minWidth: 72,
    maxWidth: 96,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    alignSelf: 'center',
  },
  labelText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
