import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import {
  addCompletedCourse as addCompletedCourseApi,
  deleteCompletedCourse as deleteCompletedCourseApi,
} from '../api/completedCoursesApi';
import { AuthApiError } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { useProfileStore } from '../stores/profileStore';
import type { RootStackParamList } from '../navigation/RootNavigator';

const MAX_COMPLETED_COURSES = 30;

export function useSyncCompletedCourses(defaultYear: number) {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const accessToken = useAuthStore((s) => s.accessToken);
  const profile = useProfileStore((s) => s.profile);
  const loadProfile = useProfileStore((s) => s.loadProfile);
  const [isSaving, setIsSaving] = useState(false);

  const handleApiError = useCallback(
    (err: unknown): void => {
      if (err instanceof AuthApiError) {
        switch (err.code) {
          case 'AUTH_REQUIRED':
            rootNavigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
            break;
          default:
            if (__DEV__) console.warn('[syncCourses]', err.code, err.message);
        }
      } else if (__DEV__) {
        console.warn('[syncCourses] network error');
      }
    },
    [rootNavigation]
  );

  const syncCompletedCourses = useCallback(
    async (nextNames: string[]): Promise<boolean> => {
      if (!accessToken) {
        rootNavigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
        return false;
      }

      const uniqueNext = [...new Set(nextNames.map((n) => n.trim()).filter(Boolean))];
      if (uniqueNext.length > MAX_COMPLETED_COURSES) {
        return false;
      }

      const currentSubjects = profile?.completedSubjects ?? [];
      const currentNames = currentSubjects.map((s) => s.name);
      const toAdd = uniqueNext.filter((n) => !currentNames.includes(n));
      const toRemove = currentSubjects.filter((s) => !uniqueNext.includes(s.name));

      setIsSaving(true);
      try {
        for (const name of toAdd) {
          await addCompletedCourseApi(accessToken, {
            subjectName: name,
            year: defaultYear,
            semester: 1,
          });
        }
        for (const subject of toRemove) {
          await deleteCompletedCourseApi(accessToken, subject.subjectId);
        }
        await loadProfile(accessToken, rootNavigation);
        return true;
      } catch (err) {
        handleApiError(err);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [accessToken, defaultYear, handleApiError, loadProfile, profile?.completedSubjects, rootNavigation]
  );

  return { syncCompletedCourses, isSaving };
}
