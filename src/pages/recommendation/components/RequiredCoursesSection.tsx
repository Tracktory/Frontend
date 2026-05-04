import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../styles/colors';

const MAX_ITEMS = 5;

interface RequiredCoursesSectionProps {
  courses: string[];
}

export function RequiredCoursesSection({ courses }: RequiredCoursesSectionProps) {
  const list = courses.slice(0, MAX_ITEMS);

  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>전필 과목</Text>
      {list.length === 0 ? (
        <Text style={styles.empty}>등록된 전필 과목이 없습니다.</Text>
      ) : (
        <View style={styles.list}>
          {list.map((name, index) => (
            <View key={name} style={styles.row}>
              <Text style={styles.bullet}>{index + 1}.</Text>
              <Text style={styles.courseName}>{name}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 10,
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    width: 24,
  },
  courseName: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  empty: {
    fontSize: 14,
    color: colors.textHint,
  },
});
