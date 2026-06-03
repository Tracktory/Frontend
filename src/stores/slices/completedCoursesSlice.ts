import type { StateCreator } from 'zustand';

const MAX_COMPLETED_COURSES = 30;

export interface CompletedCoursesSlice {
  completedCourses: string[];
  addCompletedCourse: (name: string) => boolean;
  removeCompletedCourse: (name: string) => void;
  setCompletedCourses: (names: string[]) => void;
}

export const createCompletedCoursesSlice: StateCreator<CompletedCoursesSlice> = (set, get) => ({
  completedCourses: [],
  addCompletedCourse: (name: string): boolean => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    const { completedCourses } = get();
    if (completedCourses.includes(trimmed)) return false;
    if (completedCourses.length >= MAX_COMPLETED_COURSES) return false;
    set({ completedCourses: [...completedCourses, trimmed] });
    return true;
  },
  removeCompletedCourse: (name: string) => {
    set((state) => ({
      completedCourses: state.completedCourses.filter((c) => c !== name),
    }));
  },
  setCompletedCourses: (names: string[]) => {
    const unique = [...new Set(names.map((n) => n.trim()).filter(Boolean))].slice(
      0,
      MAX_COMPLETED_COURSES,
    );
    set({ completedCourses: unique });
  },
});
