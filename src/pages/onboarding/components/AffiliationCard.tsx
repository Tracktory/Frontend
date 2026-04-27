import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface AffiliationCardProps {
  title: string;
  description: string;
  linkText: string;
  selected?: boolean;
  onPress: () => void;
}

export function AffiliationCard({
  title,
  description,
  linkText,
  selected = false,
  onPress,
}: AffiliationCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        selected && styles.selectedCard,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.link}>{linkText}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    padding: 18,
    marginBottom: 12,
  },
  selectedCard: {
    borderColor: '#2563EB',
    backgroundColor: '#F0F4FF',
  },
  pressed: {
    opacity: 0.92,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 6,
  },
  description: {
    fontSize: 18,
    lineHeight: 24,
    color: '#737373',
    marginBottom: 8,
  },
  link: {
    fontSize: 17,
    lineHeight: 24,
    color: '#2563EB',
    fontWeight: '500',
  },
});
