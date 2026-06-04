import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import Logo from '@/src/assets/images/Logo.svg';

type HeroVariant = 'preview' | 'completion';

interface OnboardingSparklesHeroProps {
  variant: HeroVariant;
  title: string;
  subtitle?: string;
  subtitleLine2?: string;
}

const PREVIEW_SIZE = 64;
const COMPLETION_SIZE = 96;

export function OnboardingSparklesHero({
  variant,
  title,
  subtitle,
  subtitleLine2,
}: OnboardingSparklesHeroProps) {
  const isCompletion = variant === 'completion';
  const boxSize = isCompletion ? COMPLETION_SIZE : PREVIEW_SIZE;
  const iconSize = isCompletion ? 40 : 32;

  const scale = useSharedValue(isCompletion ? 0 : 1);

  useEffect(() => {
    if (isCompletion) {
      scale.value = withDelay(200, withSpring(1, { stiffness: 200, damping: 14 }));
    }
  }, [isCompletion, scale]);

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.wrap}>
      {isCompletion ? (
        <Animated.View style={[styles.logoWrap, iconAnimStyle]}>
          <Logo width={96} height={84} />
        </Animated.View>
      ) : (
        <Animated.View
          style={[styles.iconBox, { width: boxSize, height: boxSize }]}
        >
          <Svg width={boxSize} height={boxSize} style={StyleSheet.absoluteFillObject}>
            <Defs>
              <LinearGradient id="sparklesHeroGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#14B8A6" />
                <Stop offset="1" stopColor="#0D9488" />
              </LinearGradient>
            </Defs>
            <Rect
              x={0}
              y={0}
              width={boxSize}
              height={boxSize}
              rx={16}
              ry={16}
              fill="url(#sparklesHeroGrad)"
            />
          </Svg>
          <Ionicons name="sparkles" size={iconSize} color="#FFFFFF" />
        </Animated.View>
      )}

      <Text style={[styles.title, isCompletion && styles.titleCompletion]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, isCompletion && styles.subtitleCompletion]}>
          {subtitle}
          {subtitleLine2 ? `\n${subtitleLine2}` : ''}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  iconBox: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleCompletion: {
    fontSize: 26,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  subtitleCompletion: {
    lineHeight: 24,
    marginBottom: 32,
  },
});
