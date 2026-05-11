import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../styles/colors';

interface MyProfileSectionProps {
  displayName: string;
  profileInitial: string;
  majorLine: string;
  admissionBadge: string;
}

export function MyProfileSection({
  displayName,
  profileInitial,
  majorLine,
  admissionBadge,
}: MyProfileSectionProps) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{profileInitial}</Text>
      </View>
      <View style={styles.textCol}>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.sub}>{majorLine}</Text>
        <Text style={styles.sub}>{admissionBadge}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.profileSurface,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
  },
  textCol: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sub: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
