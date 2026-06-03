import { useCallback, useMemo, useState } from 'react';

import { hansungCourseData, type HansungCourse } from '../data/hansungCourseData';

const IT_TRACK_KEYWORDS = [
  '빅데이터',
  '컴퓨터',
  'AI',
  '웹',
  '소프트웨어',
  'IT',
  '정보',
  '디지털',
];

const MAX_TRACKS = 6;
const MAX_COURSES_PER_TRACK = 10;

export type CourseRegisterSection = {
  track: string;
  courses: HansungCourse[];
};

export function getCourseRegisterSections(): CourseRegisterSection[] {
  const byTrack = new Map<string, HansungCourse[]>();

  for (const course of hansungCourseData) {
    const matchesIt = IT_TRACK_KEYWORDS.some((kw) => course.track.includes(kw));
    if (!matchesIt) continue;

    const list = byTrack.get(course.track) ?? [];
    if (list.length < MAX_COURSES_PER_TRACK) {
      list.push(course);
      byTrack.set(course.track, list);
    }
  }

  return [...byTrack.entries()]
    .slice(0, MAX_TRACKS)
    .map(([track, courses]) => ({ track, courses }));
}

export function useCompletedCourseSelection(initialCompleted: string[]) {
  const [draft, setDraft] = useState<Set<string>>(() => new Set(initialCompleted));

  const sections = useMemo(() => getCourseRegisterSections(), []);

  const selectedCount = draft.size;

  const toggleCourse = useCallback((subject: string) => {
    setDraft((prev) => {
      const next = new Set(prev);
      if (next.has(subject)) {
        next.delete(subject);
      } else {
        next.add(subject);
      }
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setDraft(new Set());
  }, []);

  const isSelected = useCallback((subject: string) => draft.has(subject), [draft]);

  const getSelectedNames = useCallback(() => [...draft], [draft]);

  const resetDraft = useCallback((names: string[]) => {
    setDraft(new Set(names));
  }, []);

  return {
    sections,
    selectedCount,
    toggleCourse,
    clearAll,
    isSelected,
    getSelectedNames,
    resetDraft,
  };
}
