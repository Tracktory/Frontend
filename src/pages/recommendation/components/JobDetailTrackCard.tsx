import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

interface Props {
  name: string;
  description: string;
}

export function JobDetailTrackCard({ name, description }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>트랙</Text>
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.selectSurfaceActive,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textStrong,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
