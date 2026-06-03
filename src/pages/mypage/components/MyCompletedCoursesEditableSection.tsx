import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { MYPAGE_REGISTERABLE_TIERS } from '../data/mypageRegisterableTiers';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface MyCompletedCoursesEditableSectionProps {
  courses: string[];
  isAddingCourse?: boolean;
  removingCourseName?: string | null;
  onAddCourse: (subjectName: string) => Promise<boolean>;
  onRemoveCourse: (name: string) => void | Promise<void>;
}

export function MyCompletedCoursesEditableSection({
  courses,
  isAddingCourse = false,
  removingCourseName = null,
  onAddCourse,
  onRemoveCourse,
}: MyCompletedCoursesEditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [expandedTierId, setExpandedTierId] = useState<string | null>(null);

  const availableTiers = useMemo(
    () =>
      MYPAGE_REGISTERABLE_TIERS.map((tier) => ({
        ...tier,
        available: tier.courses.filter((c) => !courses.includes(c)),
      })).filter((tier) => tier.available.length > 0),
    [courses]
  );

  const allRegistered =
    MYPAGE_REGISTERABLE_TIERS.every((tier) =>
      tier.courses.every((c) => courses.includes(c))
    );

  const toggleEditing = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsEditing((v) => !v);
    if (isEditing) setExpandedTierId(null);
  };

  const toggleTier = (tierId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedTierId((prev) => (prev === tierId ? null : tierId));
  };

  const handleAdd = async (subjectName: string) => {
    await onAddCourse(subjectName);
  };

  return (
    <View style={styles.wrap}>
      <View style={[styles.card, isEditing && styles.cardEditing]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="checkmark-circle" size={18} color="#14B8A6" />
            <Text style={styles.headerTitle}>이수 완료 과목</Text>
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>{courses.length}</Text>
            </View>
          </View>
          <Pressable
            style={[styles.editToggle, isEditing && styles.editToggleActive]}
            onPress={toggleEditing}
          >
            <Ionicons
              name={isEditing ? 'checkmark' : 'pencil'}
              size={14}
              color={isEditing ? '#FFFFFF' : '#374151'}
            />
            {isEditing ? <Text style={styles.editToggleDone}>완료</Text> : null}
          </Pressable>
        </View>

        {courses.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>등록된 이수 과목이 없어요.</Text>
            <Text style={styles.emptyHint}>{'"편집" 버튼을 눌러 과목을 추가해보세요.'}</Text>
            {!isEditing ? (
              <Pressable style={styles.emptyCta} onPress={toggleEditing}>
                <Ionicons name="add" size={16} color="#FFFFFF" />
                <Text style={styles.emptyCtaText}>과목 추가하기</Text>
              </Pressable>
            ) : null}
          </View>
        ) : (
          <View style={styles.chipRow}>
            {courses.map((name) => (
              <View key={name} style={styles.chip}>
                <Text style={styles.chipText}>{name}</Text>
                {isEditing ? (
                  <Pressable
                    hitSlop={6}
                    onPress={() => onRemoveCourse(name)}
                    disabled={removingCourseName === name}
                  >
                    {removingCourseName === name ? (
                      <ActivityIndicator size="small" color="#0D9488" />
                    ) : (
                      <Ionicons name="close-circle" size={16} color="#0D9488" />
                    )}
                  </Pressable>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {isEditing ? (
          <View style={styles.addPanel}>
            <Text style={styles.addPanelTitle}>과목 추가</Text>
            {allRegistered ? (
              <Text style={styles.allDone}>모든 과목을 이수 등록했어요 🎉</Text>
            ) : (
              availableTiers.map((tier) => {
                const expanded = expandedTierId === tier.id;
                return (
                  <View key={tier.id} style={styles.tierBlock}>
                    <Pressable style={styles.tierHeader} onPress={() => toggleTier(tier.id)}>
                      <Text style={styles.tierLabel}>{tier.label}</Text>
                      <View style={styles.tierCountPill}>
                        <Text style={styles.tierCountText}>{tier.available.length}</Text>
                      </View>
                      <Ionicons
                        name={expanded ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color="#14B8A6"
                      />
                    </Pressable>
                    {expanded ? (
                      <View style={styles.tierCourses}>
                        {tier.available.map((subject) => (
                          <Pressable
                            key={subject}
                            style={styles.addPill}
                            disabled={isAddingCourse}
                            onPress={() => handleAdd(subject)}
                          >
                            <Ionicons name="add" size={14} color="#14B8A6" />
                            <Text style={styles.addPillText}>{subject}</Text>
                          </Pressable>
                        ))}
                      </View>
                    ) : null}
                  </View>
                );
              })
            )}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
  },
  cardEditing: {
    borderColor: '#14B8A6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  countPill: {
    backgroundColor: '#F0FDFA',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  editToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editToggleActive: {
    backgroundColor: '#14B8A6',
  },
  editToggleDone: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  emptyTitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  emptyHint: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  emptyCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#14B8A6',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 8,
  },
  emptyCtaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#CCFBF1',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 13,
    color: '#0D9488',
    fontWeight: '500',
  },
  addPanel: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 14,
    gap: 10,
  },
  addPanelTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  allDone: {
    fontSize: 13,
    color: '#0D9488',
    textAlign: 'center',
    paddingVertical: 8,
  },
  tierBlock: {
    gap: 8,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  tierLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#14B8A6',
  },
  tierCountPill: {
    backgroundColor: '#F0FDFA',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tierCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  tierCourses: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingLeft: 4,
  },
  addPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    backgroundColor: '#F0FDFA',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addPillText: {
    fontSize: 12,
    color: '#0D9488',
    fontWeight: '500',
  },
});
