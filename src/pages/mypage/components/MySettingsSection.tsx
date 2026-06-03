import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function MySettingsSection() {
  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 기능은 준비 중입니다.');
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <Pressable
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          onPress={handleLogout}
        >
          <Text style={styles.emoji}>🚪</Text>
          <Text style={[styles.label, styles.labelDanger]}>로그아웃</Text>
          <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  rowPressed: {
    backgroundColor: '#F9FAFB',
  },
  emoji: {
    fontSize: 18,
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  labelDanger: {
    color: '#EF4444',
  },
});
