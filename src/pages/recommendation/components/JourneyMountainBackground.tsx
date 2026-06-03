import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop,
  Line,
} from 'react-native-svg';

interface JourneyMountainBackgroundProps {
  width: number;
  height: number;
}

export function JourneyMountainBackground({ width, height }: JourneyMountainBackgroundProps) {
  const cx = width / 2;

  return (
    <View style={[styles.wrap, { width, height }]} pointerEvents="none">
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id="bgMount" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#CCFBF1" stopOpacity="1" />
            <Stop offset="1" stopColor="#F0FDFA" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="deepMount" x1="0" y1="1" x2="1" y2="0">
            <Stop offset="0" stopColor="#0F766E" stopOpacity="0.55" />
            <Stop offset="1" stopColor="#14B8A6" stopOpacity="0.35" />
          </LinearGradient>
          <LinearGradient id="frontMount" x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0" stopColor="#5EEAD4" stopOpacity="0.9" />
            <Stop offset="1" stopColor="#CCFBF1" stopOpacity="0.5" />
          </LinearGradient>
        </Defs>

        <Path d={`M0,0 H${width} V${height} H0 Z`} fill="url(#bgMount)" />

        <Path
          d={`M0,${height * 0.55} L${width * 0.15},${height * 0.35} L${width * 0.35},${height * 0.5} L${width * 0.55},${height * 0.25} L${width * 0.75},${height * 0.45} L${width},${height * 0.3} L${width},${height} L0,${height} Z`}
          fill="url(#deepMount)"
        />
        <Path
          d={`M0,${height * 0.72} L${width * 0.25},${height * 0.52} L${width * 0.45},${height * 0.62} L${cx},${height * 0.38} L${width * 0.7},${height * 0.58} L${width},${height * 0.48} L${width},${height} L0,${height} Z`}
          fill="url(#frontMount)"
        />

        <Line
          x1={cx}
          y1={height * 0.12}
          x2={cx}
          y2={height * 0.88}
          stroke="#FFFFFF"
          strokeWidth={2.5}
          strokeDasharray="8 6"
          strokeOpacity={0.92}
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
  },
});
