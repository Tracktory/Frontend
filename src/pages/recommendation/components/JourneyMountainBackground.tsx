import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  FeGaussianBlur,
  FeMerge,
  FeMergeNode,
  Filter,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import {
  CLIMB_VIEWBOX,
  EXPLORE_VIEWBOX,
  WINDING_TRAIL_PATH,
} from './homeMountainPaths';

const TEAL_SURFACE = '#F0FDFA';

interface JourneyMountainBackgroundProps {
  width: number;
  height: number;
  /** true: 2학년+ & 트랙 선택 — 전체 산 + 흰색 길 */
  showFullMountainBackground: boolean;
}

function ExploreMountainSilhouette({ width, height }: { width: number; height: number }) {
  return (
    <View style={[styles.exploreWrap, { width, height }]} pointerEvents="none">
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${EXPLORE_VIEWBOX.width} ${EXPLORE_VIEWBOX.height}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <Path
          d="M0,250 L60,180 L120,210 L180,150 L240,190 L300,160 L375,200 L375,500 L0,500 Z"
          fill="#CCFBF1"
        />
        <Path
          d="M0,300 L80,240 L160,270 L240,220 L320,260 L375,240 L375,500 L0,500 Z"
          fill="#99F6E4"
        />
      </Svg>
    </View>
  );
}

function ClimbMountainBackground({ width, height }: { width: number; height: number }) {
  return (
    <View style={[styles.climbWrap, { width, height }]} pointerEvents="none">
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${CLIMB_VIEWBOX.width} ${CLIMB_VIEWBOX.height}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <Defs>
          <LinearGradient id="homeSkyGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#E0F7F4" />
            <Stop offset="100%" stopColor="#F0FDFA" />
          </LinearGradient>
          <Filter id="homeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <FeGaussianBlur in="SourceGraphic" stdDeviation="3" result="coloredBlur" />
            <FeMerge>
              <FeMergeNode in="coloredBlur" />
              <FeMergeNode in="SourceGraphic" />
            </FeMerge>
          </Filter>
        </Defs>

        <Rect width={375} height={740} fill="url(#homeSkyGrad)" />

        <Path
          d="M0,380 L50,300 L100,340 L155,240 L210,310 L265,270 L310,300 L340,260 L375,310 L375,740 L0,740 Z"
          fill="#CCFBF1"
          opacity={0.6}
        />
        <Path
          d="M0,460 L40,390 L90,420 L140,350 L190,390 L240,360 L290,400 L330,370 L375,410 L375,740 L0,740 Z"
          fill="#99F6E4"
          opacity={0.5}
        />
        <Path
          d="M0,550 L70,500 L140,520 L200,490 L260,515 L320,500 L375,525 L375,740 L0,740 Z"
          fill="#5EEAD4"
          opacity={0.35}
        />
        <Path
          d="M0,600 L90,565 L180,580 L270,562 L375,580 L375,740 L0,740 Z"
          fill="#2DD4BF"
          opacity={0.2}
        />

        {/* 흰색 굽은 길 — 점선 + glow */}
        <Path
          d={WINDING_TRAIL_PATH}
          stroke="#FFFFFF"
          strokeWidth={3.5}
          fill="none"
          strokeLinecap="round"
          strokeDasharray="8 5"
          filter="url(#homeGlow)"
          opacity={0.9}
        />
        {/* 흰색 굽은 길 — 실선 오버레이 */}
        <Path
          d={WINDING_TRAIL_PATH}
          stroke="#FFFFFF"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          opacity={0.6}
        />
      </Svg>
    </View>
  );
}

export function JourneyMountainBackground({
  width,
  height,
  showFullMountainBackground,
}: JourneyMountainBackgroundProps) {
  if (width <= 0 || height <= 0) return null;

  return (
    <View style={[styles.root, { width, height, backgroundColor: TEAL_SURFACE }]}>
      {showFullMountainBackground ? (
        <ClimbMountainBackground width={width} height={height} />
      ) : (
        <ExploreMountainSilhouette width={width} height={height} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'hidden',
  },
  climbWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  exploreWrap: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
});
