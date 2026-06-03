import React, { useCallback, useEffect, useRef } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../styles/colors';
import type { MainStackParamList } from '../MainStackNavigator';
import type { MainTabParamList } from '../MainTabNavigator';

import HomeIcon from '../../assets/images/Home.svg';
import HomeActiveIcon from '../../assets/images/Home_Active.svg';
import MyPageIcon from '../../assets/images/MyPage.svg';
import MyPageActiveIcon from '../../assets/images/MyPage_active.svg';

const DIAL_TABS: { name: keyof MainTabParamList; label: string; sub?: string }[] = [
  { name: 'Home', label: '홈', sub: '추천 결과' },
  { name: 'MyPage', label: '마이', sub: '마이페이지' },
];

const ITEM_WIDTH = 120;

export function BottomDialTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const lastHomePress = useRef(0);

  const activeRouteName = state.routes[state.index]?.name;
  const activeDialIndex = DIAL_TABS.findIndex((t) => t.name === activeRouteName);

  const scrollToIndex = useCallback((index: number) => {
    const x = Math.max(0, index * ITEM_WIDTH - ITEM_WIDTH * 0.5);
    scrollRef.current?.scrollTo({ x, animated: true });
  }, []);

  useEffect(() => {
    if (activeDialIndex >= 0) {
      scrollToIndex(activeDialIndex);
    }
  }, [activeDialIndex, scrollToIndex]);

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

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.dotsLeft}>
        <Text style={styles.decorDot}>•••</Text>
      </View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
      >
        {DIAL_TABS.map((tab, index) => {
          const isFocused = activeRouteName === tab.name;
          return (
            <Pressable
              key={tab.name}
              style={[
                styles.item,
                { width: ITEM_WIDTH },
                isFocused ? styles.itemActive : styles.itemInactive,
              ]}
              onPress={() => handlePress(tab.name, isFocused)}
            >
              <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                {tab.name === 'Home' ? (
                  isFocused ? (
                    <HomeActiveIcon width={22} height={22} />
                  ) : (
                    <HomeIcon width={22} height={22} />
                  )
                ) : isFocused ? (
                  <MyPageActiveIcon width={22} height={22} />
                ) : (
                  <MyPageIcon width={22} height={22} />
                )}
              </View>
              <Text style={[styles.label, isFocused && styles.labelActive]}>{tab.label}</Text>
              {tab.sub ? (
                <Text style={[styles.sub, isFocused && styles.subActive]}>{tab.sub}</Text>
              ) : null}
              {isFocused ? <View style={styles.dot} /> : null}
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={styles.dotsRight}>
        <Text style={styles.decorDot}>•••</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 28,
    paddingTop: 8,
    zIndex: 35,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  dotsLeft: {
    paddingLeft: 12,
  },
  dotsRight: {
    paddingRight: 12,
  },
  decorDot: {
    fontSize: 10,
    color: colors.textHint,
    letterSpacing: 2,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  item: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  itemActive: {
    transform: [{ scale: 1.08 }],
  },
  itemInactive: {
    transform: [{ scale: 0.92 }],
    opacity: 0.85,
  },
  iconWrap: {
    padding: 10,
    borderRadius: 24,
    marginBottom: 2,
  },
  iconWrapActive: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  labelActive: {
    color: colors.primary,
    fontSize: 14,
    transform: [{ scale: 1.05 }],
  },
  sub: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  subActive: {
    color: colors.primary,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
});
