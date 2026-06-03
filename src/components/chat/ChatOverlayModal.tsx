import React, { useCallback } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
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
  const tabBarClearance = getModalBottomTabBarClearance(insets);
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
        <View
          style={[
            styles.sheet,
            {
              paddingTop: insets.top,
              marginBottom: tabBarClearance,
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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    height: '85%',
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
});
