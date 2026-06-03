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

import type { JourneySheetKey } from '../../../hooks/useRecommendResultViewModel';
import { colors } from '../../../styles/colors';
import { CurrentPositionAvatar } from './CurrentPositionAvatar';
import { JOURNEY_NODE_LAYOUT, JOURNEY_VIEWBOX } from './JourneyLayout';

const NODE_SIZE_DEFAULT = 52;
const NODE_SIZE_CURRENT = 40;
const COMPETENCY_KEY = 'competency';
const JOB_KEY = 'job';
const TRACK_KEY = 'trackSynergy';
const ROADMAP_KEY = 'roadmap';
const CURRENT_KEY = 'current';
const TRAIL_NODE_SIZE = 40;
const TRAIL_NODE_LAYOUT_WIDTH = 72;

interface JourneyPathNodesProps {
  mapWidth: number;
  mapHeight: number;
  alignToTrail: boolean;
  activeSheet: JourneySheetKey;
  onOpenSheet: (key: NonNullable<JourneySheetKey>) => void;
}

function nodeIcon(name: string): keyof typeof Ionicons.glyphMap {
  const map: Record<string, keyof typeof Ionicons.glyphMap> = {
    flag: 'flag',
    compass: 'compass',
    person: 'person',
    book: 'book',
    library: 'library',
    'git-network': 'git-network',
  };
  return map[name] ?? 'ellipse';
}

const RIPPLE_DURATION = 1400;
const RIPPLE_PAUSE_MS = 1000;
const RIPPLE_MAX_SCALE = 1.75;
const RIPPLE_START_OPACITY = 0.45;

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
    <Animated.View
      style={[styles.pulseRing, rippleStyle]}
      pointerEvents="none"
    />
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

function TrailNodeButton({
  isActive,
  nodeColor,
  icon,
  label,
  onPress,
  showPulse = true,
}: {
  isActive: boolean;
  nodeColor: string;
  icon: string;
  label: string;
  onPress: () => void;
  showPulse?: boolean;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(isActive ? 1.15 : 1, { duration: 200 });
  }, [isActive, scale]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      style={styles.trackNodeWrap}
      onPress={onPress}
      accessibilityLabel={label}
    >
      {showPulse ? <DualRippleRings /> : null}
      <Animated.View
        style={[
          styles.trackNodeCircle,
          { backgroundColor: nodeColor },
          isActive ? styles.trackNodeCircleActive : styles.trackNodeCircleDefault,
          circleStyle,
        ]}
      >
        <Ionicons name={nodeIcon(icon)} size={16} color={colors.white} />
      </Animated.View>
      <View style={styles.trackLabelPill}>
        <Text style={styles.trackLabelText} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

export function JourneyPathNodes({
  mapWidth,
  mapHeight,
  alignToTrail,
  activeSheet,
  onOpenSheet,
}: JourneyPathNodesProps) {
  return (
    <View style={[styles.wrap, { width: mapWidth, height: mapHeight }]} pointerEvents="box-none">
      {JOURNEY_NODE_LAYOUT.map((node) => {
        const isTrack = node.key === TRACK_KEY;
        const isRoadmap = node.key === ROADMAP_KEY;
        const isCurrent = node.key === CURRENT_KEY;
        const isJob = node.key === JOB_KEY;
        const isCompetency = node.key === COMPETENCY_KEY;
        const isTrailNode =
          alignToTrail && (isCompetency || isJob || isTrack || isRoadmap);
        const nodeSize = isTrailNode || isCurrent ? TRAIL_NODE_SIZE : NODE_SIZE_DEFAULT;
        const layoutWidth =
          isCurrent || isTrailNode ? TRAIL_NODE_LAYOUT_WIDTH : alignToTrail ? nodeSize : 100;
        const positionSize = isCurrent ? NODE_SIZE_CURRENT : nodeSize;
        const left = alignToTrail
          ? (node.x / JOURNEY_VIEWBOX.width) * mapWidth - layoutWidth / 2
          : mapWidth / 2 - 50;
        const top = alignToTrail
          ? (node.y / JOURNEY_VIEWBOX.height) * mapHeight - positionSize / 2
          : (node.y / JOURNEY_VIEWBOX.height) * mapHeight - 28;

        if (isCurrent && alignToTrail) {
          return (
            <View
              key={node.key}
              style={[styles.nodePosition, { left, top, width: TRAIL_NODE_LAYOUT_WIDTH }]}
              pointerEvents="box-none"
            >
              <CurrentPositionAvatar
                label={node.label}
                onPress={() => onOpenSheet(CURRENT_KEY)}
              />
            </View>
          );
        }

        if (isTrailNode) {
          return (
            <View
              key={node.key}
              style={[styles.nodePosition, { left, top, width: TRAIL_NODE_LAYOUT_WIDTH }]}
              pointerEvents="box-none"
            >
              <TrailNodeButton
                isActive={activeSheet === node.key}
                nodeColor={node.nodeColor}
                icon={node.icon}
                label={node.label}
                onPress={() => onOpenSheet(node.key!)}
                showPulse={activeSheet == null}
              />
            </View>
          );
        }

        return (
          <Pressable
            key={node.key}
            style={[
              styles.nodeWrap,
              { left, top, width: alignToTrail ? nodeSize : 100 },
            ]}
            onPress={() => onOpenSheet(node.key!)}
            accessibilityLabel={node.label}
          >
            <View
              style={[
                styles.nodeCircle,
                node.isFlag ? styles.nodeFlag : { backgroundColor: node.nodeColor },
              ]}
            >
              <Ionicons
                name={nodeIcon(node.icon)}
                size={node.isFlag ? 18 : 20}
                color={colors.white}
              />
            </View>
            <Text
              style={[styles.nodeLabel, alignToTrail && styles.nodeLabelTrail]}
              numberOfLines={1}
            >
              {node.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 15,
  },
  nodePosition: {
    position: 'absolute',
    alignItems: 'center',
    overflow: 'visible',
  },
  trackNodeWrap: {
    alignItems: 'center',
    width: TRAIL_NODE_LAYOUT_WIDTH,
    overflow: 'visible',
  },
  pulseRing: {
    position: 'absolute',
    top: 0,
    left: (TRAIL_NODE_LAYOUT_WIDTH - TRAIL_NODE_SIZE) / 2,
    width: TRAIL_NODE_SIZE,
    height: TRAIL_NODE_SIZE,
    borderRadius: TRAIL_NODE_SIZE / 2,
    borderWidth: 2,
    borderColor: '#14B8A6',
  },
  trackNodeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackNodeCircleDefault: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  trackNodeCircleActive: {
    borderWidth: 3,
    borderColor: colors.white,
  },
  trackLabelPill: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.85)',
    maxWidth: TRAIL_NODE_LAYOUT_WIDTH,
    alignSelf: 'center',
  },
  trackLabelText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0D9488',
    textAlign: 'center',
    flexShrink: 0,
  },
  nodeWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  nodeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  nodeFlag: {
    backgroundColor: '#EF4444',
  },
  nodeLabel: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  nodeLabelTrail: {
    position: 'absolute',
    top: 54,
    width: 88,
    marginTop: 0,
  },
});
