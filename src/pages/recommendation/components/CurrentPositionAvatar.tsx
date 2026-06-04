import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const AVATAR_SIZE = 40;
const LAYOUT_WIDTH = 72;
const BREATHE_MIN_SCALE = 0.98;
const BREATHE_MAX_SCALE = 1.02;
const BREATHE_HALF_MS = 1250;

interface CurrentPositionAvatarProps {
  label?: string;
  onPress: () => void;
}

export function CurrentPositionAvatar({
  label = '현재 위치',
  onPress,
}: CurrentPositionAvatarProps) {
  const scale = useSharedValue(BREATHE_MIN_SCALE);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(BREATHE_MAX_SCALE, { duration: BREATHE_HALF_MS }),
      -1,
      true,
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
        <Text style={styles.emoji}>🧑‍💻</Text>
      </Animated.View>
      <View style={styles.labelPill}>
        <Text style={styles.labelText} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    width: LAYOUT_WIDTH,
  },
  avatarOuter: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#14B8A6',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  emoji: {
    fontSize: 16,
    lineHeight: 22,
  },
  labelPill: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#14B8A6',
    maxWidth: LAYOUT_WIDTH,
    alignSelf: 'center',
  },
  labelText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    flexShrink: 0,
  },
});
