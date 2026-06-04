import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface JobBriefingLinkCardProps {
  onPress: () => void;
}

export function JobBriefingLinkCard({ onPress }: JobBriefingLinkCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityLabel="관련 트렌드 더 보기"
    >
      <View style={styles.left}>
        <Text style={styles.emoji}>🔥</Text>
        <Text style={styles.label}>관련 트렌드 더 보기</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#14B8A6" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    borderRadius: 24,
    padding: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.92,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  emoji: {
    fontSize: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D9488',
  },
});
