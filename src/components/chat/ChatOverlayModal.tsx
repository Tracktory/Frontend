import React from 'react';
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { colors } from '../../styles/colors';
import { ChatContent } from './ChatContent';

interface ChatOverlayModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ChatOverlayModal({ visible, onClose }: ChatOverlayModalProps) {
  const { height } = useWindowDimensions();
  const sheetHeight = height * 0.85;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.sheet, { height: sheetHeight }]}>
          <ChatContent showClose overlayMode onClose={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
});
