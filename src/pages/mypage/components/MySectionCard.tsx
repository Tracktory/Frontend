import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MySectionCardProps {
  title: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  children: React.ReactNode;
  borderColor?: string;
}

export function MySectionCard({
  title,
  iconName,
  iconColor = '#14B8A6',
  children,
  borderColor = '#E5E7EB',
}: MySectionCardProps) {
  return (
    <View style={[styles.card, { borderColor }]}>
      <View style={styles.header}>
        {iconName ? <Ionicons name={iconName} size={16} color={iconColor} /> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
});
