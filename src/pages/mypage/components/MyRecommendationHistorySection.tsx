import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { MYPAGE_RECOMMENDATION_LOGS } from '../data/mypageRecommendationLogs';
import { MySectionCard } from './MySectionCard';

export function MyRecommendationHistorySection() {
  return (
    <View style={styles.wrap}>
      <MySectionCard title="추천 이력" iconName="time-outline">
        <View style={styles.list}>
          {MYPAGE_RECOMMENDATION_LOGS.map((log) => (
            <View key={log.id} style={styles.row}>
              <View style={styles.rowTop}>
                <Text style={styles.rowTitle}>{log.title}</Text>
                <View style={styles.tagPill}>
                  <Text style={styles.tagText}>{log.tag}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
              </View>
              <Text style={styles.rowDesc}>{log.desc}</Text>
              <Text style={styles.rowDate}>{log.date}</Text>
            </View>
          ))}
        </View>
      </MySectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
  },
  list: {
    gap: 10,
  },
  row: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  tagPill: {
    backgroundColor: '#F0FDFA',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D9488',
  },
  rowDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  rowDate: {
    fontSize: 11,
    color: '#D1D5DB',
  },
});
