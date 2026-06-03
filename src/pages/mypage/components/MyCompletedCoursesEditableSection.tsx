import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { HansungCourse } from '../../../data/hansungCourseData';

const PRIORITY_TRACKS = [
  '모바일소프트웨어트랙',
  '웹공학트랙',
  '빅데이터트랙',
  '디지털콘텐츠ㆍ가상현실트랙',
] as const;

const LIST_VIEW_HEIGHT = 320;

const PRIORITY_TRACK_RANK = new Map<string, number>(
  PRIORITY_TRACKS.map((track, index) => [track, index]),
);

function sortTrackEntries(entries: { track: string; count: number }[]) {
  return [...entries].sort((a, b) => {
    const aRank = PRIORITY_TRACK_RANK.get(a.track) ?? PRIORITY_TRACKS.length;
    const bRank = PRIORITY_TRACK_RANK.get(b.track) ?? PRIORITY_TRACKS.length;
    if (aRank !== bRank) return aRank - bRank;
    return a.track.localeCompare(b.track, 'ko');
  });
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type PickerStep = 'tracks' | 'courses';

interface MyCompletedCoursesEditableSectionProps {
  courses: string[];
  catalog: HansungCourse[];
  isAddingCourse?: boolean;
  removingCourseName?: string | null;
  autoOpenEditor?: boolean;
  onEditorOpened?: () => void;
  onAddCourse: (course: HansungCourse) => Promise<boolean>;
  onRemoveCourse: (name: string) => void | Promise<void>;
}

function resetPickerState(
  setPickerStep: (s: PickerStep) => void,
  setSelectedTrack: (t: string | null) => void,
  setSearchQuery: (q: string) => void,
) {
  setPickerStep('tracks');
  setSelectedTrack(null);
  setSearchQuery('');
}

function PickerListFrame({
  header,
  children,
}: {
  header?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.listBlock}>
      {header}
      <ScrollView
        style={styles.listScroll}
        contentContainerStyle={styles.listScrollContent}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

export function MyCompletedCoursesEditableSection({
  courses,
  catalog,
  isAddingCourse = false,
  removingCourseName = null,
  autoOpenEditor = false,
  onEditorOpened,
  onAddCourse,
  onRemoveCourse,
}: MyCompletedCoursesEditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [pickerStep, setPickerStep] = useState<PickerStep>('tracks');
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const completedSet = useMemo(() => new Set(courses), [courses]);

  const trackEntries = useMemo(() => {
    const byTrack = new Map<string, number>();
    for (const item of catalog) {
      if (completedSet.has(item.subject)) continue;
      byTrack.set(item.track, (byTrack.get(item.track) ?? 0) + 1);
    }
    return sortTrackEntries(
      [...byTrack.entries()].map(([track, count]) => ({ track, count })),
    );
  }, [catalog, completedSet]);

  const coursesInTrack = useMemo(() => {
    if (!selectedTrack) return [];
    return catalog.filter(
      (c) => c.track === selectedTrack && !completedSet.has(c.subject),
    );
  }, [catalog, selectedTrack, completedSet]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return catalog.filter(
      (c) =>
        !completedSet.has(c.subject) &&
        (c.subject.toLowerCase().includes(q) || c.track.toLowerCase().includes(q)),
    );
  }, [catalog, searchQuery, completedSet]);

  const hasSearch = searchQuery.trim().length > 0;

  useEffect(() => {
    if (!autoOpenEditor) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsEditing(true);
    onEditorOpened?.();
  }, [autoOpenEditor, onEditorOpened]);

  useEffect(() => {
    if (
      isEditing &&
      !hasSearch &&
      pickerStep === 'courses' &&
      selectedTrack &&
      coursesInTrack.length === 0
    ) {
      setPickerStep('tracks');
      setSelectedTrack(null);
    }
  }, [isEditing, hasSearch, pickerStep, selectedTrack, coursesInTrack.length]);

  const toggleEditing = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (isEditing) {
      resetPickerState(setPickerStep, setSelectedTrack, setSearchQuery);
    }
    setIsEditing((v) => !v);
  };

  const selectTrack = (track: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedTrack(track);
    setPickerStep('courses');
    setSearchQuery('');
  };

  const goBackToTracks = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPickerStep('tracks');
    setSelectedTrack(null);
  };

  const handleAdd = async (course: HansungCourse) => {
    await onAddCourse(course);
  };

  const renderCourseRow = (course: HansungCourse, meta?: string) => (
    <Pressable
      key={`${course.track}-${course.subject}`}
      style={({ pressed }) => [styles.courseRow, pressed && styles.rowPressed]}
      disabled={isAddingCourse}
      onPress={() => handleAdd(course)}
    >
      <View style={styles.courseRowText}>
        <Text style={styles.courseSubject} numberOfLines={2}>
          {course.subject}
        </Text>
        <Text style={styles.courseMeta}>
          {meta ?? `${course.track} · ${course.credit}학점`}
        </Text>
      </View>
      {isAddingCourse ? (
        <ActivityIndicator size="small" color="#14B8A6" />
      ) : (
        <Ionicons name="add-circle" size={22} color="#14B8A6" />
      )}
    </Pressable>
  );

  const renderAddPanel = () => {
    if (!isEditing) return null;

    let listContent: React.ReactNode;
    let listHeader: React.ReactNode;

    if (hasSearch) {
      listHeader = undefined;
      listContent =
        searchResults.length === 0 ? (
          <Text style={styles.emptyPicker}>검색 결과가 없습니다.</Text>
        ) : (
          searchResults.map((course) => renderCourseRow(course))
        );
    } else if (pickerStep === 'courses' && selectedTrack) {
      listHeader = (
        <Pressable style={styles.backRow} onPress={goBackToTracks}>
          <Ionicons name="chevron-back" size={18} color="#14B8A6" />
          <Text style={styles.backText} numberOfLines={1}>
            {selectedTrack}
          </Text>
        </Pressable>
      );
      listContent =
        coursesInTrack.length === 0 ? (
          <Text style={styles.emptyPicker}>추가할 수 있는 과목이 없어요.</Text>
        ) : (
          coursesInTrack.map((course) =>
            renderCourseRow(course, `${course.credit}학점`),
          )
        );
    } else {
      listHeader = undefined;
      listContent =
        trackEntries.length === 0 ? (
          <Text style={styles.emptyPicker}>추가할 수 있는 과목이 없어요.</Text>
        ) : (
          trackEntries.map(({ track, count }) => (
            <Pressable
              key={track}
              style={({ pressed }) => [styles.trackRow, pressed && styles.rowPressed]}
              onPress={() => selectTrack(track)}
            >
              <Text style={styles.trackLabel} numberOfLines={2}>
                {track}
              </Text>
              <View style={styles.trackCountPill}>
                <Text style={styles.trackCountText}>{count}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#14B8A6" />
            </Pressable>
          ))
        );
    }

    return (
      <View style={styles.addPanel}>
        <Text style={styles.addPanelTitle}>과목 추가</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="과목명 또는 트랙 검색"
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          editable={!isAddingCourse}
        />

        <PickerListFrame header={listHeader}>{listContent}</PickerListFrame>
      </View>
    );
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

        {renderAddPanel()}
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
  searchInput: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  listBlock: {
    height: LIST_VIEW_HEIGHT,
    overflow: 'hidden',
  },
  listScroll: {
    flex: 1,
  },
  listScrollContent: {
    gap: 6,
    flexGrow: 1,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  trackLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#14B8A6',
  },
  trackCountPill: {
    backgroundColor: '#F0FDFA',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  trackCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    marginBottom: 4,
  },
  backText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#14B8A6',
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  courseRowText: {
    flex: 1,
    gap: 2,
  },
  courseSubject: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  courseMeta: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  rowPressed: {
    backgroundColor: '#F0FDFA',
  },
  emptyPicker: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 12,
  },
});
