import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AnalysisReportHeaderProps {
  subtitle: string;
  anchorJobLabel?: string | null;
  onBack: () => void;
}

export function AnalysisReportHeader({
  subtitle,
  anchorJobLabel,
  onBack,
}: AnalysisReportHeaderProps) {
  return (
    <View style={styles.wrap}>
      <Pressable style={styles.iconBtn} onPress={onBack} hitSlop={8}>
        <Ionicons name="chevron-back" size={18} color="#374151" />
      </Pressable>
      <View style={styles.center}>
        <Text style={styles.title}>상세 분석 리포트</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {anchorJobLabel ? (
          <Text style={styles.anchorLabel}>{anchorJobLabel}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(249,250,251,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  anchorLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D9488',
    marginTop: 4,
  },
});
