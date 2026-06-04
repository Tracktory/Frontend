import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatContent } from '../../components/chat/ChatContent';
import { getBottomTabBarClearance } from '../../navigation/layout/tabBarLayout';
import { colors } from '../../styles/colors';

/** 탭 네비 챗봇 화면 — chatStore 메시지와 동일 스토어 사용 */
export function ChatBotPage() {
  const insets = useSafeAreaInsets();
  const tabBarClearance = getBottomTabBarClearance(insets);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        <ChatContent
          showClose={false}
          showMinimize={false}
          bottomInset={tabBarClearance}
          includeTopInsetInOffset={false}
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
