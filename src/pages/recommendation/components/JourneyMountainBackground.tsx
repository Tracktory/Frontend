import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import HomeBackground from '@/src/assets/images/background.svg';

import { EXPLORE_VIEWBOX } from './homeMountainPaths';

const TEAL_SURFACE = '#F0FDFA';

interface JourneyMountainBackgroundProps {
  /** true: 2학년+ & 트랙 선택 — background.svg */
  showFullMountainBackground: boolean;
}

function ExploreMountainSilhouette({ width, height }: { width: number; height: number }) {
  return (
    <Svg
      style={StyleSheet.absoluteFillObject}
      width={width}
      height={height}
      viewBox={`0 0 ${EXPLORE_VIEWBOX.width} ${EXPLORE_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <Rect
        x={0}
        y={0}
        width={EXPLORE_VIEWBOX.width}
        height={EXPLORE_VIEWBOX.height}
        fill={TEAL_SURFACE}
      />
      <Path
        d="M0,250 L60,180 L120,210 L180,150 L240,190 L300,160 L375,200 L375,500 L0,500 Z"
        fill="#CCFBF1"
      />
      <Path
        d="M0,300 L80,240 L160,270 L240,220 L320,260 L375,240 L375,500 L0,500 Z"
        fill="#99F6E4"
      />
    </Svg>
  );
}

function ClimbHomeBackground({ width, height }: { width: number; height: number }) {
  return (
    <HomeBackground
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid slice"
      style={StyleSheet.absoluteFillObject}
    />
  );
}

export function JourneyMountainBackground({
  showFullMountainBackground,
}: JourneyMountainBackgroundProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setSize({ width, height });
    }
  };

  return (
    <View
      style={[styles.root, { backgroundColor: TEAL_SURFACE }]}
      onLayout={onLayout}
      pointerEvents="none"
    >
      {size.width > 0 ? (
        showFullMountainBackground ? (
          <ClimbHomeBackground width={size.width} height={size.height} />
        ) : (
          <ExploreMountainSilhouette width={size.width} height={size.height} />
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
});
