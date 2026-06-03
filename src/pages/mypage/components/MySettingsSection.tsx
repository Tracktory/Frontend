import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SETTINGS_ROWS = [
  { id: 'notifications', emoji: '🔔', label: '알림 설정', danger: false },
  { id: 'about', emoji: 'ℹ️', label: '앱 정보', danger: false },
  { id: 'logout', emoji: '🚪', label: '로그아웃', danger: true },
] as const;

export function MySettingsSection() {
  const handlePress = (id: string) => {
    if (id === 'logout') {
      Alert.alert('로그아웃', '로그아웃 기능은 준비 중입니다.');
      return;
    }
    Alert.alert('안내', '해당 기능은 준비 중입니다.');
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        {SETTINGS_ROWS.map((row, index) => (
          <View key={row.id}>
            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => handlePress(row.id)}
            >
              <Text style={styles.emoji}>{row.emoji}</Text>
              <Text style={[styles.label, row.danger && styles.labelDanger]}>{row.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </Pressable>
            {index < SETTINGS_ROWS.length - 1 ? <View style={styles.divider} /> : null}
          </View>
        ))}
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
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
  },
});
