import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../styles/colors';
import { useChatStore } from '../../stores/chatStore';
import { ChatContent } from './ChatContent';
import { MAIN_TAB_BAR_HEIGHT, FAB_RIGHT, FAB_SIZE } from './constants';

const { height: SCREEN_H } = Dimensions.get('window');
const SHEET_HEIGHT = Math.round(SCREEN_H * 0.88);
const MINIMIZED_HEIGHT = 56;

export function ChatOverlayHost() {
  const insets = useSafeAreaInsets();
  const overlayOpen = useChatStore((s) => s.overlayOpen);
  const overlayMinimized = useChatStore((s) => s.overlayMinimized);
  const openOverlay = useChatStore((s) => s.openOverlay);
  const closeOverlay = useChatStore((s) => s.closeOverlay);
  const toggleMinimize = useChatStore((s) => s.toggleMinimize);

  // 현재 루트 스크린 이름으로 온보딩 완료 여부 판단
  const rootRouteName = useNavigationState((state) => {
    if (!state || !state.routes) return null;
    return state.routes[state.index]?.name ?? null;
  });
  const isOnboarding = rootRouteName === 'Onboarding';

  // 메인 탭일 때 FAB/시트 하단 오프셋에 탭바 높이 추가
  const tabBarOffset = isOnboarding ? 0 : MAIN_TAB_BAR_HEIGHT;

  const fabBottom = insets.bottom + tabBarOffset + 16;
  const sheetBottomPad = isOnboarding ? insets.bottom : insets.bottom + tabBarOffset;

  // 시트 높이 애니메이션
  const sheetH = useRef(new Animated.Value(overlayOpen ? SHEET_HEIGHT : 0)).current;
  const sheetVisible = useRef(overlayOpen).current;

  useEffect(() => {
    if (overlayOpen) {
      const targetH = overlayMinimized ? MINIMIZED_HEIGHT : SHEET_HEIGHT;
      Animated.spring(sheetH, {
        toValue: targetH,
        useNativeDriver: false,
        damping: 20,
        stiffness: 180,
      }).start();
    } else {
      Animated.timing(sheetH, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }).start();
    }
  }, [overlayOpen, overlayMinimized, sheetH]);

  void sheetVisible;

  return (
    <>
      {/* 슬라이드업 오버레이 모달 */}
      <Modal
        transparent
        visible={overlayOpen}
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeOverlay}
      >
        {/* 딤 배경 — 탭 시 닫기 */}
        <Pressable style={styles.dimLayer} onPress={closeOverlay} />

        {/* 시트 */}
        <Animated.View
          style={[
            styles.sheet,
            { height: sheetH, paddingBottom: sheetBottomPad },
          ]}
        >
          {overlayMinimized ? (
            // 최소화 상태: 헤더 바만 표시
            <Pressable style={styles.miniHeader} onPress={toggleMinimize}>
              <View style={styles.miniHandle} />
            </Pressable>
          ) : (
            <ChatContent
              onboardingRequired={isOnboarding}
              showMinimize
              showClose
              onMinimize={toggleMinimize}
              onClose={closeOverlay}
            />
          )}
        </Animated.View>
      </Modal>

      {/* 플로팅 버튼 — 오버레이 닫혀 있을 때만 표시 */}
      {!overlayOpen && (
        <Pressable
          style={[
            styles.fab,
            { bottom: fabBottom, right: FAB_RIGHT },
          ]}
          onPress={openOverlay}
          hitSlop={8}
        >
          <Ionicons name="chatbubble-ellipses" size={26} color={colors.white} />
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  dimLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 16,
  },
  miniHeader: {
    height: MINIMIZED_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  miniHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  fab: {
    position: 'absolute',
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 8,
  },
});
