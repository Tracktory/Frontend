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

import type { JourneySheetKey } from '../../../hooks/useRecommendResultViewModel';
import { getModalBottomTabBarClearance } from '../../../navigation/layout/tabBarLayout';
import { colors } from '../../../styles/colors';

import { SHEET_TITLES } from './JourneyLayout';



const SHEET_TIMING = { duration: 280, easing: Easing.out(Easing.cubic) };



function resolveSheetTitle(

  sheetKey: JourneySheetKey | null | undefined,

  titleOverride?: string,

): string {

  if (titleOverride) return titleOverride;

  if (!sheetKey) return '';

  if (sheetKey === 'trackSynergy') return '🔗 트랙 시너지';

  if (sheetKey === 'current') return '📍 현재 학습 현황';

  if (sheetKey === 'job') return '🧭 직무 매칭';

  if (sheetKey === 'competency') return '🏆 최종 역량 커버리지';

  if (sheetKey === 'register') return '📋 이수 과목 등록';

  return SHEET_TITLES[sheetKey];

}



interface JourneyBottomSheetProps {

  visible: boolean;

  sheetKey?: JourneySheetKey;

  titleOverride?: string;

  onClose: () => void;

  children: React.ReactNode;

}



export function JourneyBottomSheet({

  visible,

  sheetKey = null,

  titleOverride,

  onClose,

  children,

}: JourneyBottomSheetProps) {

  const insets = useSafeAreaInsets();
  const tabBarClearance = getModalBottomTabBarClearance(insets);

  const { height } = useWindowDimensions();

  const sheetHeight = height * 0.7;



  const [mounted, setMounted] = useState(false);

  const translateY = useSharedValue(sheetHeight);



  const shouldShow = visible && (!!sheetKey || !!titleOverride);



  useEffect(() => {

    if (shouldShow) {

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

  }, [shouldShow, mounted, sheetHeight, translateY]);



  const sheetStyle = useAnimatedStyle(() => ({

    transform: [{ translateY: translateY.value }],

  }));



  if (!mounted) return null;



  const title = resolveSheetTitle(sheetKey, titleOverride);



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

          <Text style={styles.title}>{title}</Text>

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

    zIndex: 30,

  },

  backdrop: {

    ...StyleSheet.absoluteFillObject,

    backgroundColor: 'rgba(0,0,0,0.35)',

  },

  sheet: {

    position: 'absolute',

    left: 0,

    right: 0,

    bottom: 0,

    backgroundColor: colors.white,

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

  title: {

    flex: 1,

    fontSize: 18,

    fontWeight: '700',

    color: '#111827',

    paddingRight: 12,

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


