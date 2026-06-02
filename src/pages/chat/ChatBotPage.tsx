import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../styles/colors';
import { ChatContent } from '../../components/chat/ChatContent';
import { useAuthStore } from '../../stores/authStore';
import { useChatStore } from '../../stores/chatStore';

/** 탭 네비 챗봇 화면 — chatStore 메시지와 동일 스토어 사용 */
export function ChatBotPage() {
  const userId = useAuthStore((s) => s.userId);
  const enterChatScreen = useChatStore((s) => s.enterChatScreen);

  useFocusEffect(
    useCallback(() => {
      if (userId != null) {
        enterChatScreen(userId);
      }
    }, [userId, enterChatScreen])
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        <ChatContent showClose={false} showMinimize={false} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
  },
});
