import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useCompletedCourseSelection } from '../../../../hooks/useCompletedCourseSelection';
import { useOnboardingStore } from '../../../../stores/onboardingStore';

interface JourneyCourseRegisterSheetProps {
  onComplete: () => void;
}

export function JourneyCourseRegisterSheet({ onComplete }: JourneyCourseRegisterSheetProps) {
  const completedCourses = useOnboardingStore((s) => s.completedCourses);
  const setCompletedCourses = useOnboardingStore((s) => s.setCompletedCourses);

  const {
    sections,
    selectedCount,
    toggleCourse,
    clearAll,
    isSelected,
    getSelectedNames,
    resetDraft,
  } = useCompletedCourseSelection(completedCourses);

  useEffect(() => {
    resetDraft(completedCourses);
  }, [completedCourses, resetDraft]);

  const handleSubmit = () => {
    setCompletedCourses(getSelectedNames());
    onComplete();
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.toolbar}>
        <Text style={styles.countText}>{selectedCount}개 과목 선택됨</Text>
        <Pressable onPress={clearAll} hitSlop={8}>
          <Text style={styles.clearText}>전체 해제</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => (
          <View key={section.track} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.track}</Text>
            <View style={styles.chipRow}>
              {section.courses.map((course) => {
                const selected = isSelected(course.subject);
                return (
                  <Pressable
                    key={`${section.track}-${course.subject}`}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => toggleCourse(course.subject)}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {course.subject}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      <Pressable
        style={({ pressed }) => [
          styles.cta,
          selectedCount === 0 && styles.ctaDisabled,
          pressed && selectedCount > 0 && styles.ctaPressed,
        ]}
        onPress={handleSubmit}
        disabled={selectedCount === 0}
      >
        <Text style={styles.ctaText}>{selectedCount}개 과목 등록 완료</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minHeight: 280,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D9488',
  },
  scroll: {
    flex: 1,
    maxHeight: 360,
  },
  scrollContent: {
    paddingBottom: 16,
    gap: 16,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  chipSelected: {
    borderColor: '#14B8A6',
    backgroundColor: '#CCFBF1',
  },
  chipText: {
    fontSize: 12,
    color: '#4B5563',
  },
  chipTextSelected: {
    color: '#0D9488',
    fontWeight: '600',
  },
  cta: {
    marginTop: 16,
    backgroundColor: '#14B8A6',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaDisabled: {
    opacity: 0.45,
  },
  ctaPressed: {
    opacity: 0.92,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
