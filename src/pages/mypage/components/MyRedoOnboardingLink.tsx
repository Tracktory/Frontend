import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../../../styles/colors';

interface MyRedoOnboardingLinkProps {
  onPress: () => void;
}

export function MyRedoOnboardingLink({ onPress }: MyRedoOnboardingLinkProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Text style={styles.text}>온보딩 다시하기</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  pressed: {
    opacity: 0.65,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
});
