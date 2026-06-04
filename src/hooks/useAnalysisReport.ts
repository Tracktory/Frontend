import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { AuthApiError } from '../api/authApi';
import { fetchRecommendResult } from '../api/recommendApi';
import {
  fetchRecommendationReport,
  type RecommendationReportData,
} from '../api/recommendReportApi';
import type { JobRecommendation } from '../data/mockRecommendData';
import type { RoadmapPayload } from '../data/mockRoadmapData';
import type { TrackRecommendPayload } from '../data/mockTrackRecommendData';
import type { RootStackParamList } from '../navigation/RootNavigator';
import {
  buildAnalysisReportModel,
  type AnalysisReportModel,
} from '../pages/recommendation/utils/buildAnalysisReportModel';
import { useRecommendStore } from '../stores/recommendStore';

export type AnalysisReportLocalParams = {
  roadmap: RoadmapPayload | null;
  completedCourses: string[];
  jobs: JobRecommendation[];
  trackRecommend: TrackRecommendPayload | null;
  displayName: string;
  studentId?: string;
  studentYear: number;
};

type UseAnalysisReportParams = {
  visible: boolean;
  accessToken: string | null;
  localParams: AnalysisReportLocalParams;
  onFatalError?: () => void;
};

export function useAnalysisReport({
  visible,
  accessToken,
  localParams,
  onFatalError,
}: UseAnalysisReportParams) {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const setRecommendResult = useRecommendStore((s) => s.setRecommendResult);

  const [report, setReport] = useState<RecommendationReportData | null>(null);
  const [anchorJobCode, setAnchorJobCode] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fetchGen = useRef(0);
  const retriedRecommend = useRef(false);

  const resetAnchorToPrimary = useCallback((data: RecommendationReportData) => {
    setAnchorJobCode(data.anchorJob?.code);
  }, []);

  const loadReport = useCallback(
    async (code: string | undefined, allowRecommendRetry: boolean) => {
      if (!accessToken) return;

      const gen = ++fetchGen.current;
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await fetchRecommendationReport(accessToken, code);
        if (gen !== fetchGen.current) return;

        setReport(data);
        if (code === undefined) {
          resetAnchorToPrimary(data);
        }
        retriedRecommend.current = false;
      } catch (err) {
        if (gen !== fetchGen.current) return;

        if (err instanceof AuthApiError) {
          switch (err.code) {
            case 'RECOMMENDATION_NOT_FOUND':
              if (allowRecommendRetry && !retriedRecommend.current) {
                retriedRecommend.current = true;
                try {
                  const rec = await fetchRecommendResult(accessToken, true);
                  setRecommendResult(rec);
                  await loadReport(code, false);
                  return;
                } catch {
                  setErrorMessage('추천을 생성한 뒤 리포트를 불러오지 못했어요.');
                  onFatalError?.();
                }
                return;
              }
              setErrorMessage(err.message);
              onFatalError?.();
              break;
            case 'ONBOARDING_NOT_FOUND':
              Alert.alert('온보딩 필요', err.message, [
                {
                  text: '확인',
                  onPress: () =>
                    rootNavigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] }),
                },
              ]);
              onFatalError?.();
              break;
            case 'INVALID_ANCHOR_JOB':
              Alert.alert('기준 직무 오류', err.message);
              setAnchorJobCode(undefined);
              void loadReport(undefined, false);
              break;
            case 'AUTH_REQUIRED':
              Alert.alert('인증 만료', '다시 로그인해주세요.');
              rootNavigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
              onFatalError?.();
              break;
            default:
              setErrorMessage(err.message);
          }
        } else {
          setErrorMessage('리포트를 불러오지 못했습니다.');
        }
      } finally {
        if (gen === fetchGen.current) {
          setIsLoading(false);
        }
      }
    },
    [
      accessToken,
      onFatalError,
      resetAnchorToPrimary,
      rootNavigation,
      setRecommendResult,
    ]
  );

  useEffect(() => {
    if (!visible) {
      fetchGen.current += 1;
      setIsLoading(false);
      return;
    }
    if (!accessToken) return;

    retriedRecommend.current = false;
    setReport(null);
    setAnchorJobCode(undefined);
    void loadReport(undefined, true);
  }, [visible, accessToken, loadReport]);

  const selectAnchorJobCode = useCallback(
    (code: string) => {
      setAnchorJobCode(code);
      void loadReport(code, false);
    },
    [loadReport]
  );

  const retry = useCallback(() => {
    retriedRecommend.current = false;
    void loadReport(anchorJobCode, true);
  }, [anchorJobCode, loadReport]);

  const model: AnalysisReportModel = useMemo(
    () =>
      buildAnalysisReportModel({
        report,
        anchorJobCode,
        ...localParams,
      }),
    [report, anchorJobCode, localParams]
  );

  return {
    model,
    report,
    anchorJobCode,
    isLoading,
    errorMessage,
    selectAnchorJobCode,
    retry,
  };
}
