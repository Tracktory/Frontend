import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../styles/colors';

interface ChatFabProps {
  onPress: () => void;
  /** Distance from screen bottom; defaults above dial tab bar. */
  bottomOffset?: number;
}

export function ChatFab({ onPress, bottomOffset = 100 }: ChatFabProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.fab,
        { bottom: bottomOffset },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityLabel="AI 챗봇 열기"
    >
      <Ionicons name="chatbubble" size={26} color={colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  pressed: {
    opacity: 0.9,
  },
});
