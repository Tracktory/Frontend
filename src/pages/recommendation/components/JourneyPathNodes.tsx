import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { JourneySheetKey } from '../../../hooks/useRecommendResultViewModel';
import { colors } from '../../../styles/colors';
import { JOURNEY_NODE_LAYOUT, JOURNEY_VIEWBOX } from './JourneyLayout';

const NODE_SIZE = 52;

interface JourneyPathNodesProps {
  mapWidth: number;
  mapHeight: number;
  /** 등반형: 길 위 좌표 / 탐색형: 가로 중앙 + y 비율 */
  alignToTrail: boolean;
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
  onOpenSheet,
}: JourneyPathNodesProps) {
  return (
    <View style={[styles.wrap, { width: mapWidth, height: mapHeight }]} pointerEvents="box-none">
      {JOURNEY_NODE_LAYOUT.map((node) => {
        const left = alignToTrail
          ? (node.x / JOURNEY_VIEWBOX.width) * mapWidth - NODE_SIZE / 2
          : mapWidth / 2 - 50;
        const top = alignToTrail
          ? (node.y / JOURNEY_VIEWBOX.height) * mapHeight - NODE_SIZE / 2
          : (node.y / JOURNEY_VIEWBOX.height) * mapHeight - 28;

        return (
          <Pressable
            key={node.key}
            style={[styles.nodeWrap, { left, top, width: alignToTrail ? NODE_SIZE : 100 }]}
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
            <Text style={[styles.nodeLabel, alignToTrail && styles.nodeLabelTrail]}>
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
