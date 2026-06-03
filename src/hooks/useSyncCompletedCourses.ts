import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
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
          case 'SUBJECT_ALREADY_COMPLETED':
            Alert.alert('알림', '이미 이수 처리된 과목입니다.');
            break;
          case 'VALIDATION_FAILED':
            Alert.alert('입력 오류', '입력 내용을 다시 확인해주세요.');
            break;
          default:
            Alert.alert('오류', err.message);
        }
      } else {
        Alert.alert('네트워크 오류', '잠시 후 다시 시도해주세요.');
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
        Alert.alert(
          '알림',
          `이수 과목은 최대 ${MAX_COMPLETED_COURSES}개까지 등록할 수 있습니다.`
        );
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
