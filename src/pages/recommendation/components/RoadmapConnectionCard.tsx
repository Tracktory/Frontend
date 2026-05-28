import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { colors } from '../../../styles/colors';
import type { MainTabParamList } from '../../../navigation/MainTabNavigator';

interface RoadmapConnectionCardProps {
  connectionMessage: string;
  hasCompletedCourses: boolean;
  remainingSemesters: number;
  semesterRange: string;
}

export function RoadmapConnectionCard({
  connectionMessage,
  hasCompletedCourses,
  remainingSemesters,
  semesterRange,
}: RoadmapConnectionCardProps) {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  return (
    <View style={styles.wrap}>
      {/* 연결 메시지 카드 */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.cardHeaderText}>이렇게 연결돼요</Text>
        </View>

        {hasCompletedCourses ? (
          <Text style={styles.connectionText}>{connectionMessage}</Text>
        ) : (
          <Pressable
            style={styles.emptyRow}
            onPress={() => navigation.navigate('MyPage')}
            accessibilityLabel="마이페이지로 이동"
          >
            <Text style={styles.emptyText}>마이페이지에서 이수과목을 등록해주세요</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </Pressable>
        )}
      </View>

      {/* 잔여 학기 안내 */}
      {hasCompletedCourses && (
        <Text style={styles.subtitle}>
          잔여 {remainingSemesters}학기 · {semesterRange}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#F0F4FF',
    borderRadius: 10,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  cardHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  connectionText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    fontWeight: '500',
  },
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emptyText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 12,
    color: colors.textSecondary,
    paddingHorizontal: 2,
  },
});
