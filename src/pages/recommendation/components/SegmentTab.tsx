import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../styles/colors';

export type TabKey = 'job' | 'track' | 'roadmap';

const TAB_LABELS: Record<TabKey, string> = {
  job: '직무추천',
  track: '트랙추천',
  roadmap: '학습 로드맵',
};

const TAB_KEYS: TabKey[] = ['job', 'track', 'roadmap'];

interface SegmentTabProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function SegmentTab({ activeTab, onTabChange }: SegmentTabProps) {
  return (
    <View style={styles.container}>
      {TAB_KEYS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <Pressable
            key={tab}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onTabChange(tab)}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {TAB_LABELS[tab]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 9,
  },
  tabActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
