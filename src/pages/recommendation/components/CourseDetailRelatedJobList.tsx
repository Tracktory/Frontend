import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

interface Props {
  jobs: string[];
}

export function CourseDetailRelatedJobList({ jobs }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>관련 직무</Text>
      <View style={styles.chipRow}>
        {jobs.map((job) => (
          <View key={job} style={styles.chip}>
            <Text style={styles.chipText}>{job}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textStrong,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.primary,
  },
});
