import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { getModalBottomTabBarClearance } from '../../../../navigation/layout/tabBarLayout';

const SHEET_TIMING = { duration: 280, easing: Easing.out(Easing.cubic) };

interface JourneyAIBriefingBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function JourneyAIBriefingBottomSheet({
  visible,
  onClose,
  children,
}: JourneyAIBriefingBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const tabBarClearance = getModalBottomTabBarClearance(insets);
  const { height } = useWindowDimensions();
  const sheetHeight = height * 0.7;

  const [mounted, setMounted] = useState(false);
  const translateY = useSharedValue(sheetHeight);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateY.value = sheetHeight;
      translateY.value = withTiming(0, SHEET_TIMING);
      return;
    }
    if (mounted) {
      translateY.value = withTiming(sheetHeight, SHEET_TIMING, (finished) => {
        if (finished) {
          runOnJS(setMounted)(false);
        }
      });
    }
  }, [visible, mounted, sheetHeight, translateY]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const shouldShow = visible || mounted;
  if (!shouldShow) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View
        style={[
          styles.sheet,
          sheetStyle,
          { height: sheetHeight, bottom: tabBarClearance, paddingBottom: 16 },
        ]}
      >
        <View style={styles.handle} />
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name="sparkles" size={18} color="#14B8A6" />
            <Text style={styles.title}>AI 직무 브리핑</Text>
          </View>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            accessibilityLabel="닫기"
            style={styles.closeButton}
          >
            <Ionicons name="close" size={16} color="#6B7280" />
          </Pressable>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 35,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 36,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    marginTop: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
});
