import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../styles/colors';
import type { MainStackParamList } from '../MainStackNavigator';
import type { MainTabParamList } from '../MainTabNavigator';
import {
  DIAL_TAB_BAR_CONTENT_HEIGHT,
  DIAL_TAB_BAR_PADDING_TOP,
} from '../layout/tabBarLayout';

const DIAL_TABS: { name: keyof MainTabParamList; label: string }[] = [
  { name: 'Home', label: '홈' },
  { name: 'MyPage', label: '마이' },
];

const DIAL_TRACK_WIDTH = 228;
const DIAL_TRACK_HEIGHT = 52;
const TAB_SLOT_WIDTH = DIAL_TRACK_WIDTH / 2;
const DIAL_ICON_SIZE = 22;
const PILL_SPRING = { damping: 25, stiffness: 300 };

export function BottomDialTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const lastHomePress = useRef(0);
  const pillX = useSharedValue(0);

  const activeRouteName = state.routes[state.index]?.name;
  const activeDialIndex = Math.max(
    0,
    DIAL_TABS.findIndex((t) => t.name === activeRouteName)
  );

  useEffect(() => {
    pillX.value = withSpring(activeDialIndex * TAB_SLOT_WIDTH, PILL_SPRING);
  }, [activeDialIndex, pillX]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
  }));

  const handlePress = (routeName: keyof MainTabParamList, isFocused: boolean) => {
    const route = state.routes.find((r) => r.name === routeName);
    if (!route) return;

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (routeName === 'Home' && isFocused) {
      const now = Date.now();
      if (now - lastHomePress.current < 800) return;
      lastHomePress.current = now;
      const parent = navigation.getParent<StackNavigationProp<MainStackParamList>>();
      parent?.navigate('RecommendLoading', { forceRefresh: true });
      return;
    }

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: DIAL_TAB_BAR_PADDING_TOP,
          paddingBottom: bottomInset,
          minHeight: DIAL_TAB_BAR_PADDING_TOP + DIAL_TAB_BAR_CONTENT_HEIGHT + bottomInset,
        },
      ]}
    >
      <View style={styles.dialWrap}>
        <View style={styles.dialTrack}>
          <Animated.View style={[styles.pill, pillStyle]} />
          {DIAL_TABS.map((tab) => {
            const isFocused = activeRouteName === tab.name;
            return (
              <Pressable
                key={tab.name}
                style={styles.tabSlot}
                onPress={() => handlePress(tab.name, isFocused)}
              >
                <Ionicons
                  name={tab.name === 'Home' ? 'home' : 'person'}
                  size={DIAL_ICON_SIZE}
                  color={isFocused ? '#FFFFFF' : '#9CA3AF'}
                />
                <Text style={[styles.label, isFocused && styles.labelActive]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    zIndex: 35,
  },
  dialWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialTrack: {
    width: DIAL_TRACK_WIDTH,
    height: DIAL_TRACK_HEIGHT,
    borderRadius: DIAL_TRACK_HEIGHT / 2,
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },
  pill: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: TAB_SLOT_WIDTH,
    height: DIAL_TRACK_HEIGHT,
    borderRadius: DIAL_TRACK_HEIGHT / 2,
    backgroundColor: colors.primary,
  },
  tabSlot: {
    width: TAB_SLOT_WIDTH,
    height: DIAL_TRACK_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    paddingTop: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    marginTop: 1,
  },
  labelActive: {
    color: '#FFFFFF',
  },
});
