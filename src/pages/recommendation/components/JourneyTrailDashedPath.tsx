import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { CLIMB_VIEWBOX, JOURNEY_CLIMB_DASH_PATH } from './homeMountainPaths';

interface JourneyTrailDashedPathProps {
  mapWidth: number;
  mapHeight: number;
}

export function JourneyTrailDashedPath({ mapWidth, mapHeight }: JourneyTrailDashedPathProps) {
  return (
    <View
      style={[styles.wrap, { width: mapWidth, height: mapHeight }]}
      pointerEvents="none"
    >
      <Svg
        width={mapWidth}
        height={mapHeight}
        viewBox={`0 0 ${CLIMB_VIEWBOX.width} ${CLIMB_VIEWBOX.height}`}
        preserveAspectRatio="none"
      >
        <Path
          d={JOURNEY_CLIMB_DASH_PATH}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={2}
          strokeDasharray="6 4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 12,
  },
});
