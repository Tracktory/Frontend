import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../styles/colors';
import type { SemesterGuide } from '../../../data/mockRoadmapData';

interface SemesterGuideSectionProps {
  guide: SemesterGuide;
}

export function SemesterGuideSection({ guide }: SemesterGuideSectionProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>학기별 수강 가이드</Text>

      {/* 다음 학기 블록 */}
      <View style={styles.block}>
        <View style={[styles.blockHeader, { borderLeftColor: colors.primary }]}>
          <Text style={styles.blockLabel}>다음 학기 추천 과목</Text>
        </View>
        <View style={styles.chipRow}>
          {guide.nextSemester.map((name) => (
            <View key={name} style={[styles.chip, { borderColor: colors.primary }]}>
              <Text style={[styles.chipText, { color: colors.primary }]}>{name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 그 다음 학기 블록 */}
      <View style={styles.block}>
        <View style={[styles.blockHeader, { borderLeftColor: colors.textSecondary }]}>
          <Text style={styles.blockLabel}>그 다음 학기 추천 과목</Text>
        </View>
        <View style={styles.chipRow}>
          {guide.afterNextSemester.map((name) => (
            <View key={name} style={styles.chipMuted}>
              <Text style={styles.chipTextMuted}>{name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  block: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  blockHeader: {
    borderLeftWidth: 3,
    paddingLeft: 8,
    marginBottom: 10,
  },
  blockLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#F0FDFA',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  chipMuted: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#F9F9F9',
  },
  chipTextMuted: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
