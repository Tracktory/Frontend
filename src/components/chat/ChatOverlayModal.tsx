import React, { useCallback } from 'react';
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../styles/colors';
import { getModalBottomTabBarClearance } from '../../navigation/layout/tabBarLayout';
import { ChatContent } from './ChatContent';
import { useAuthStore } from '../../stores/authStore';
import { useChatStore } from '../../stores/chatStore';

interface ChatOverlayModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ChatOverlayModal({ visible, onClose }: ChatOverlayModalProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const tabBarClearance = getModalBottomTabBarClearance(insets);
  const sheetHeight = height * 0.85;
  const userId = useAuthStore((s) => s.userId);
  const enterChatScreen = useChatStore((s) => s.enterChatScreen);

  const handleShow = useCallback(() => {
    if (userId != null) {
      enterChatScreen(userId);
    }
  }, [userId, enterChatScreen]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      onShow={handleShow}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            {
              height: sheetHeight,
              bottom: tabBarClearance,
              paddingTop: insets.top,
            },
          ]}
        >
          <ChatContent showClose onClose={onClose} headerHeight={insets.top + 52} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
});
