import React from 'react';
import { StyleSheet, View } from 'react-native';

import { LoadingDots } from '../LoadingDots';
import { colors } from '../../styles/colors';

export function ChatTypingBubble() {
  return (
    <View style={styles.row}>
      <View style={styles.bubble}>
        <LoadingDots size={8} spacing={6} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 12,
    maxWidth: '85%',
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
