import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const AVATAR_SIZE = 40;

interface CurrentPositionAvatarProps {
  label?: string;
  onPress: () => void;
}

export function CurrentPositionAvatar({
  label = '현재 위치',
  onPress,
}: CurrentPositionAvatarProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1250 }),
        withTiming(1, { duration: 1250 }),
      ),
      -1,
      false,
    );
  }, [scale]);

  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      style={styles.wrap}
      onPress={onPress}
      accessibilityLabel={label}
    >
      <Animated.View style={[styles.avatarOuter, breatheStyle]}>
        <View style={styles.avatarClip}>
          <Svg width={AVATAR_SIZE} height={AVATAR_SIZE}>
            <Defs>
              <LinearGradient id="currentAvatarGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#14B8A6" />
                <Stop offset="1" stopColor="#0D9488" />
              </LinearGradient>
            </Defs>
            <Circle
              cx={AVATAR_SIZE / 2}
              cy={AVATAR_SIZE / 2}
              r={AVATAR_SIZE / 2}
              fill="url(#currentAvatarGrad)"
            />
          </Svg>
          <Text style={styles.emoji}>🧑‍💻</Text>
        </View>
      </Animated.View>
      <View style={styles.labelPill}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    width: AVATAR_SIZE,
  },
  avatarOuter: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarClip: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    position: 'absolute',
    fontSize: 16,
    lineHeight: 22,
  },
  labelPill: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#14B8A6',
  },
  labelText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
