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

import MapIcon from '@/src/assets/images/map.svg';
import TrophyIcon from '@/src/assets/images/trophy.svg';
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

  if (sheetKey === 'competency') return SHEET_TITLES.competency;

  if (sheetKey === 'roadmap') return SHEET_TITLES.roadmap;

  return SHEET_TITLES[sheetKey];

}

function SheetTitleIcon({ sheetKey }: { sheetKey: JourneySheetKey | null | undefined }) {
  if (sheetKey === 'competency') {
    return <TrophyIcon width={20} height={20} />;
  }
  if (sheetKey === 'roadmap') {
    return <MapIcon width={20} height={20} />;
  }
  return null;
}



interface JourneyBottomSheetProps {

  visible: boolean;

  sheetKey?: JourneySheetKey;

  titleOverride?: string;

  showBackButton?: boolean;

  onBack?: () => void;

  onClose: () => void;

  children: React.ReactNode;

}



export function JourneyBottomSheet({

  visible,

  sheetKey = null,

  titleOverride,

  showBackButton = false,

  onBack,

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

          {showBackButton && onBack ? (
            <Pressable
              onPress={onBack}
              hitSlop={12}
              accessibilityLabel="뒤로"
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={20} color="#6B7280" />
            </Pressable>
          ) : null}

          <View style={styles.titleRow}>
            <SheetTitleIcon sheetKey={sheetKey} />
            <Text style={styles.title}>{title}</Text>
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

    zIndex: 30,

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

    gap: 8,

  },

  backButton: {

    width: 32,

    height: 32,

    borderRadius: 16,

    backgroundColor: '#F3F4F6',

    alignItems: 'center',

    justifyContent: 'center',

  },

  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 12,
    minWidth: 0,
  },

  title: {

    flex: 1,

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


