import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { JourneySheetKey } from '../../../hooks/useRecommendResultViewModel';
import { colors } from '../../../styles/colors';
import { JOURNEY_NODE_LAYOUT } from './JourneyLayout';

interface JourneyPathNodesProps {
  mapHeight: number;
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

export function JourneyPathNodes({ mapHeight, onOpenSheet }: JourneyPathNodesProps) {
  return (
    <View style={[styles.wrap, { height: mapHeight }]} pointerEvents="box-none">
      {JOURNEY_NODE_LAYOUT.map((node) => {
        const top = mapHeight * node.yRatio - 28;
        return (
          <Pressable
            key={node.key}
            style={[styles.nodeWrap, { top }]}
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
            <Text style={styles.nodeLabel}>{node.label}</Text>
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
    right: 0,
    alignItems: 'center',
  },
  nodeWrap: {
    position: 'absolute',
    alignItems: 'center',
    width: 100,
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
});
