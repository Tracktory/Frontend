import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { colors } from '../styles/colors';

interface LoadingDotsProps {
  size?: number;
  color?: string;
  spacing?: number;
}

export function LoadingDots({
  size = 12,
  color = colors.primary,
  spacing = 10,
}: LoadingDotsProps) {
  const a1 = useRef(new Animated.Value(0.3)).current;
  const a2 = useRef(new Animated.Value(0.3)).current;
  const a3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const makeLoop = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    const l1 = makeLoop(a1, 0);
    const l2 = makeLoop(a2, 150);
    const l3 = makeLoop(a3, 300);
    l1.start();
    l2.start();
    l3.start();
    return () => {
      l1.stop();
      l2.stop();
      l3.stop();
    };
  }, [a1, a2, a3]);

  const dotStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
  };

  return (
    <View style={styles.row}>
      <Animated.View style={[dotStyle, { opacity: a1 }]} />
      <Animated.View style={[dotStyle, { marginLeft: spacing, opacity: a2 }]} />
      <Animated.View style={[dotStyle, { marginLeft: spacing, opacity: a3 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
