import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface OnboardingSummaryRow {
  label: string;
  value: string;
}

interface OnboardingSummaryCardProps {
  rows: OnboardingSummaryRow[];
}

function SummaryRow({ label, value }: OnboardingSummaryRow) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

export function OnboardingSummaryCard({ rows }: OnboardingSummaryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>온보딩 요약</Text>
      <View style={styles.rows}>
        {rows.map((row) => (
          <SummaryRow key={row.label} label={row.label} value={row.value} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D9488',
    marginBottom: 12,
  },
  rows: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  rowLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    flex: 0.42,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
    flex: 0.58,
    textAlign: 'right',
  },
});
