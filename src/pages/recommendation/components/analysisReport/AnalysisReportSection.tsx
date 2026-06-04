import React, { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AnalysisReportSectionProps {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  children: ReactNode;
}

export function AnalysisReportSection({
  title,
  iconName,
  children,
}: AnalysisReportSectionProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name={iconName} size={16} color="#14B8A6" />
        <Text style={styles.title}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
});
