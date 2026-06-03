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
        <Pressable style={styles.briefingBtn} onPress={onBriefingPress}>
          <Ionicons name="sparkles" size={14} color={colors.primary} />
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
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  briefingText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
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
