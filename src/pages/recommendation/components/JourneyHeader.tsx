import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../styles/colors';

interface JourneyHeaderProps {
  displayName: string;
  profileInitial: string;
  onBriefingPress: () => void;
}

export function JourneyHeader({
  displayName,
  profileInitial,
  onBriefingPress,
}: JourneyHeaderProps) {
  const title = displayName ? `${displayName}님의 학습 여정` : '나의 학습 여정';

  return (
    <View style={styles.row}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.briefingBtn,
            pressed && styles.briefingBtnPressed,
          ]}
          onPress={onBriefingPress}
        >
          <Ionicons name="sparkles" size={14} color="#14B8A6" />
          <Text style={styles.briefingText}>AI 브리핑</Text>
        </Pressable>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profileInitial}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    zIndex: 2,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  briefingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  briefingBtnPressed: {
    opacity: 0.93,
    transform: [{ scale: 0.93 }],
  },
  briefingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});
