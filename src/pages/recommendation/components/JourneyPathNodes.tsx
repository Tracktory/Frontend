import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { JourneySheetKey } from '../../../hooks/useRecommendResultViewModel';
import { colors } from '../../../styles/colors';
import { JourneyNodeButton } from './JourneyNodeButton';
import { JOURNEY_NODE_SIZE, resolveNodeVisualState } from './JourneyNodeVisuals';
import { JOURNEY_NODE_LAYOUT, JOURNEY_VIEWBOX } from './JourneyLayout';

const NODE_SIZE_DEFAULT = 52;
const COMPETENCY_KEY = 'competency';
const JOB_KEY = 'job';
const TRACK_KEY = 'trackSynergy';
const ROADMAP_KEY = 'roadmap';
const CURRENT_KEY = 'current';
const TRAIL_NODE_SIZE = JOURNEY_NODE_SIZE;

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
    'git-network': 'git-network',
  };
  return map[name] ?? 'ellipse';
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
          alignToTrail && (isCompetency || isJob || isTrack || isRoadmap || isCurrent);
        const nodeSize = isTrailNode ? TRAIL_NODE_SIZE : NODE_SIZE_DEFAULT;
        const positionSize = isCurrent ? JOURNEY_NODE_SIZE : nodeSize;
        const left = alignToTrail
          ? (node.x / JOURNEY_VIEWBOX.width) * mapWidth - positionSize / 2
          : mapWidth / 2 - 50;
        const top = alignToTrail
          ? (node.y / JOURNEY_VIEWBOX.height) * mapHeight - positionSize / 2
          : (node.y / JOURNEY_VIEWBOX.height) * mapHeight - 28;

        if (isTrailNode && node.key) {
          const visualState = resolveNodeVisualState(node.key, activeSheet);

          return (
            <View
              key={node.key}
              style={[styles.nodePosition, { left, top, width: JOURNEY_NODE_SIZE }]}
              pointerEvents="box-none"
            >
              <JourneyNodeButton
                nodeKey={node.key}
                visualState={visualState}
                label={node.label}
                nodeColor={node.nodeColor}
                icon={isCurrent ? undefined : node.icon}
                emoji={isCurrent ? '🧑‍💻' : undefined}
                onPress={() => onOpenSheet(node.key!)}
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
              ellipsizeMode="tail"
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
