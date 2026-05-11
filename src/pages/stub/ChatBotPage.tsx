import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../styles/colors';
import { ChatContent } from '../../components/chat/ChatContent';
import { useChatStore } from '../../stores/chatStore';

/** 탭 네비게이션 챗봇 화면 — ChatOverlayHost와 동일 스토어를 공유해 대화가 이어짐 */
export function ChatBotPage() {
  const closeOverlay = useChatStore((s) => s.closeOverlay);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        <ChatContent
          showClose={false}
          showMinimize={false}
          onClose={closeOverlay}
        />
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
