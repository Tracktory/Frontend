import { useMemo } from 'react';

import type { JobRecommendation } from '../data/mockRecommendData';
import type { RoadmapPayload } from '../data/mockRoadmapData';
import type { TrackRecommendPayload } from '../data/mockTrackRecommendData';
import {
  buildAnalysisReportModel,
  type AnalysisReportModel,
} from '../pages/recommendation/utils/buildAnalysisReportModel';

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
  localParams: AnalysisReportLocalParams;
};

export function useAnalysisReport({ localParams }: UseAnalysisReportParams) {
  const model: AnalysisReportModel = useMemo(
    () => buildAnalysisReportModel(localParams),
    [
      localParams.roadmap,
      localParams.completedCourses,
      localParams.jobs,
      localParams.trackRecommend,
      localParams.displayName,
      localParams.studentId,
      localParams.studentYear,
    ],
  );

  return {
    model,
    isLoading: false,
    errorMessage: null as string | null,
  };
}
