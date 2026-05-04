import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../styles/colors';

export type TabKey = 'job' | 'track' | 'roadmap';

const TAB_LABELS: Record<TabKey, string> = {
  job: '직무',
  track: '트랙',
  roadmap: '학습 로드맵',
};

const TAB_KEYS: TabKey[] = ['job', 'track', 'roadmap'];

interface SegmentTabProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function SegmentTab({ activeTab, onTabChange }: SegmentTabProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.tabsRow}>
        {TAB_KEYS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              style={[styles.tabBtn, isActive ? styles.tabBtnActive : styles.tabBtnInactive]}
              onPress={() => onTabChange(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{TAB_LABELS[tab]}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 0,
  },
  tabBtn: {
    alignSelf: 'flex-start',
    paddingTop: 4,
    paddingBottom: 10,
    paddingRight: 22,
    marginRight: 4,
    borderBottomWidth: 3,
  },
  tabBtnActive: {
    borderBottomColor: colors.primary,
  },
  tabBtnInactive: {
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});
