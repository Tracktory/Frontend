import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../../styles/colors';
import type { HansungCourse } from '../../../data/hansungCourseData';

interface MyCompletedCoursesSectionProps {
  courses: string[];
  catalog: HansungCourse[];
  defaultYear: number;
  isAddingCourse?: boolean;
  removingCourseName?: string | null;
  onAddCourse: (
    course: HansungCourse,
    year: number,
    semester: 1 | 2
  ) => Promise<boolean>;
  onRemoveCourse: (name: string) => void | Promise<void>;
}

const YEAR_OPTIONS = [1, 2, 3, 4] as const;
const SEMESTER_OPTIONS = [1, 2] as const;

export function MyCompletedCoursesSection({
  courses,
  catalog,
  defaultYear,
  isAddingCourse = false,
  removingCourseName = null,
  onAddCourse,
  onRemoveCourse,
}: MyCompletedCoursesSectionProps) {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<HansungCourse | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(defaultYear);
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);

  const uniqueTracks = useMemo(
    () => [...new Set(catalog.map((c) => c.track))],
    [catalog]
  );

  const coursesInTrack = useMemo(() => {
    if (!selectedTrack) return [];
    return catalog.filter(
      (c) => c.track === selectedTrack && !courses.includes(c.subject)
    );
  }, [catalog, selectedTrack, courses]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return catalog.filter(
      (c) => !courses.includes(c.subject) && c.subject.toLowerCase().includes(q)
    );
  }, [catalog, courses, query]);

  const openModal = () => {
    setQuery('');
    setSelectedTrack(null);
    setSelectedCourse(null);
    setSelectedYear(defaultYear);
    setSelectedSemester(1);
    setModalVisible(true);
  };

  const closeModal = () => {
    if (isAddingCourse) return;
    setModalVisible(false);
    setQuery('');
    setSelectedTrack(null);
    setSelectedCourse(null);
  };

  const handlePickCourse = (course: HansungCourse) => {
    setSelectedCourse(course);
    setSelectedYear(defaultYear);
    setSelectedSemester(1);
  };

  const handleConfirmAdd = async () => {
    if (!selectedCourse || isAddingCourse) return;
    const ok = await onAddCourse(selectedCourse, selectedYear, selectedSemester);
    if (ok) closeModal();
  };

  const renderBody = () => {
    if (selectedCourse) {
      return (
        <>
          <Text style={styles.selectedCourseName}>{selectedCourse.subject}</Text>

          <Text style={styles.fieldLabel}>이수 학년</Text>
          <View style={styles.optionRow}>
            {YEAR_OPTIONS.map((year) => (
              <Pressable
                key={year}
                disabled={isAddingCourse}
                onPress={() => setSelectedYear(year)}
                style={[styles.optionChip, selectedYear === year && styles.optionChipActive]}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    selectedYear === year && styles.optionChipTextActive,
                  ]}
                >
                  {year}학년
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.fieldLabel}>이수 학기</Text>
          <View style={styles.optionRow}>
            {SEMESTER_OPTIONS.map((semester) => (
              <Pressable
                key={semester}
                disabled={isAddingCourse}
                onPress={() => setSelectedSemester(semester)}
                style={[
                  styles.optionChip,
                  selectedSemester === semester && styles.optionChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    selectedSemester === semester && styles.optionChipTextActive,
                  ]}
                >
                  {semester}학기
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.confirmRow}>
            <Pressable
              style={[styles.backButton, isAddingCourse && styles.buttonDisabled]}
              onPress={() => setSelectedCourse(null)}
              disabled={isAddingCourse}
            >
              <Text style={styles.backButtonText}>뒤로</Text>
            </Pressable>
            <Pressable
              style={[styles.confirmButton, isAddingCourse && styles.buttonDisabled]}
              onPress={handleConfirmAdd}
              disabled={isAddingCourse}
            >
              {isAddingCourse ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={styles.confirmButtonText}>추가</Text>
              )}
            </Pressable>
          </View>
        </>
      );
    }

    if (query.trim() !== '') {
      if (searchResults.length === 0) {
        return (
          <View style={styles.emptyList}>
            <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
          </View>
        );
      }
      return (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => `${item.track}-${item.subject}`}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.listRow, pressed && styles.listRowPressed]}
              onPress={() => handlePickCourse(item)}
            >
              <Text style={styles.listRowText} numberOfLines={1}>
                {item.subject}
              </Text>
              <View style={styles.listRowRight}>
                <Text style={styles.creditText}>{item.credit}학점</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textHint} />
              </View>
            </Pressable>
          )}
        />
      );
    }

    if (selectedTrack !== null) {
      return (
        <>
          <Pressable
            style={({ pressed }) => [styles.backRow, pressed && styles.listRowPressed]}
            onPress={() => setSelectedTrack(null)}
          >
            <Ionicons name="chevron-back" size={20} color={colors.primary} />
            <Text style={styles.backRowText} numberOfLines={1}>
              {selectedTrack}
            </Text>
          </Pressable>
          {coursesInTrack.length === 0 ? (
            <View style={styles.emptyList}>
              <Text style={styles.emptyText}>추가할 수 있는 과목이 없습니다.</Text>
            </View>
          ) : (
            <FlatList
              data={coursesInTrack}
              keyExtractor={(item) => `${item.track}-${item.subject}`}
              style={styles.list}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [styles.listRow, pressed && styles.listRowPressed]}
                  onPress={() => handlePickCourse(item)}
                >
                  <Text style={styles.listRowText} numberOfLines={1}>
                    {item.subject}
                  </Text>
                  <View style={styles.listRowRight}>
                    <Text style={styles.creditText}>{item.credit}학점</Text>
                    <Ionicons name="chevron-forward" size={18} color={colors.textHint} />
                  </View>
                </Pressable>
              )}
            />
          )}
        </>
      );
    }

    return (
      <FlatList
        data={uniqueTracks}
        keyExtractor={(item) => item}
        style={styles.list}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.listRow, pressed && styles.listRowPressed]}
            onPress={() => setSelectedTrack(item)}
          >
            <Text style={styles.listRowText} numberOfLines={1}>
              {item}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textHint} />
          </Pressable>
        )}
      />
    );
  };

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
            <Pressable
              hitSlop={6}
              onPress={() => onRemoveCourse(name)}
              disabled={removingCourseName != null}
              style={({ pressed }) => [
                styles.chipRemove,
                (pressed || removingCourseName === name) && styles.chipRemovePressed,
              ]}
              accessibilityLabel={`${name} 삭제`}
            >
              {removingCourseName === name ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons name="close-circle" size={18} color={colors.primary} />
              )}
            </Pressable>
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
        onPress={openModal}
      >
        <Ionicons name="add" size={20} color={colors.primary} />
        <Text style={styles.addBtnText}>과목 추가</Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOuter}>
          <Pressable style={styles.dim} onPress={closeModal} accessibilityLabel="닫기" />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.sheetOuter}
          >
            <View
              style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}
            >
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>
                  {selectedCourse ? '이수 학년·학기 선택' : '과목 추가'}
                </Text>
                <Pressable hitSlop={12} onPress={closeModal} disabled={isAddingCourse}>
                  <Ionicons name="close" size={26} color={colors.textSecondary} />
                </Pressable>
              </View>

              {!selectedCourse && (
                <TextInput
                  style={styles.search}
                  placeholder="과목명 검색"
                  placeholderTextColor={colors.textHint}
                  value={query}
                  onChangeText={(text) => {
                    setQuery(text);
                    if (text.trim() !== '' && selectedTrack !== null) {
                      setSelectedTrack(null);
                    }
                  }}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              )}

              {renderBody()}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.chipMintBg,
    borderRadius: 100,
    paddingVertical: 6,
    paddingLeft: 14,
    paddingRight: 6,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    gap: 4,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  chipRemove: {
    padding: 2,
  },
  chipRemovePressed: {
    opacity: 0.6,
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
  modalOuter: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  sheetOuter: {
    width: '100%',
    maxHeight: '75%',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  selectedCourseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  optionChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  optionChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionChipText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  optionChipTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  backButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 72,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  search: {
    backgroundColor: colors.inputSurface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  list: {
    maxHeight: 340,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  listRowPressed: {
    backgroundColor: colors.inputSurface,
  },
  listRowText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
    marginRight: 8,
  },
  listRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  creditText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 4,
    gap: 4,
  },
  backRowText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    flex: 1,
  },
  emptyList: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
