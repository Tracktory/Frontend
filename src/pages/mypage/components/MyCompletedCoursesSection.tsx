import React, { useMemo, useState } from 'react';
import {
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

interface MyCompletedCoursesSectionProps {
  courses: string[];
  catalog: string[];
  onAddCourse: (name: string) => boolean;
  onRemoveCourse: (name: string) => void;
}

export function MyCompletedCoursesSection({
  courses,
  catalog,
  onAddCourse,
  onRemoveCourse,
}: MyCompletedCoursesSectionProps) {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [query, setQuery] = useState('');

  const filteredCatalog = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter(
      (name) =>
        !courses.includes(name) &&
        (q === '' || name.toLowerCase().includes(q))
    );
  }, [catalog, courses, query]);

  const openModal = () => {
    setQuery('');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setQuery('');
  };

  const handlePickCourse = (name: string) => {
    const ok = onAddCourse(name);
    if (ok) {
      closeModal();
    }
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
              style={({ pressed }) => [styles.chipRemove, pressed && styles.chipRemovePressed]}
              accessibilityLabel={`${name} 삭제`}
            >
              <Ionicons name="close-circle" size={18} color={colors.primary} />
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
              style={[
                styles.sheet,
                { paddingBottom: Math.max(insets.bottom, 16) },
              ]}
            >
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>과목 추가</Text>
                <Pressable hitSlop={12} onPress={closeModal}>
                  <Ionicons name="close" size={26} color={colors.textSecondary} />
                </Pressable>
              </View>

              <TextInput
                style={styles.search}
                placeholder="과목명 검색"
                placeholderTextColor={colors.textHint}
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
                autoCapitalize="none"
              />

              {filteredCatalog.length === 0 ? (
                <View style={styles.emptyList}>
                  <Text style={styles.emptyText}>
                    {query.trim()
                      ? '검색 결과가 없습니다.'
                      : '추가할 수 있는 과목이 없습니다.'}
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={filteredCatalog}
                  keyExtractor={(item) => item}
                  style={styles.list}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <Pressable
                      style={({ pressed }) => [
                        styles.listRow,
                        pressed && styles.listRowPressed,
                      ]}
                      onPress={() => handlePickCourse(item)}
                    >
                      <Text style={styles.listRowText}>{item}</Text>
                      <Ionicons name="chevron-forward" size={18} color={colors.textHint} />
                    </Pressable>
                  )}
                />
              )}
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
    backgroundColor: 'rgba(0,0,0,0.35)',
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
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  emptyList: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
