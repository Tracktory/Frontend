import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../styles/colors';

interface MyCompletedCoursesSectionProps {
  courses: string[];
  onAddCourse: () => void;
}

export function MyCompletedCoursesSection({
  courses,
  onAddCourse,
}: MyCompletedCoursesSectionProps) {
  return (
    <>
      <Text style={styles.sectionTitle}>이수 과목</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipRow}
      >
        {courses.map((name) => (
          <View key={name} style={styles.chip}>
            <Text style={styles.chipText}>{name}</Text>
          </View>
        ))}
      </ScrollView>
      <Pressable
        style={({ pressed }) => [
          styles.addBtn,
          Platform.OS !== 'android' && styles.addBtnDash,
          Platform.OS === 'android' && styles.addBtnSolid,
          pressed && styles.addBtnPressed,
        ]}
        onPress={onAddCourse}
      >
        <Ionicons name="add" size={20} color={colors.primary} />
        <Text style={styles.addBtnText}>과목 추가</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  chipScroll: {
    flexGrow: 0,
    marginBottom: 12,
  },
  chipRow: {
    gap: 8,
    flexDirection: 'row',
    paddingRight: 4,
  },
  chip: {
    backgroundColor: colors.chipMintBg,
    borderRadius: 100,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 14,
    marginBottom: 22,
    gap: 6,
    backgroundColor: colors.white,
  },
  addBtnDash: {
    borderStyle: 'dashed',
  },
  addBtnSolid: {
    borderStyle: 'solid',
  },
  addBtnPressed: {
    opacity: 0.82,
    backgroundColor: colors.primaryLight,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
});
