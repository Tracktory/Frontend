import {
  MOCK_JOB_RECOMMENDATIONS,
  type JobRecommendation,
} from '../data/mockRecommendData';
import {
  MOCK_TRACK_RECOMMEND,
  type TrackRecommendPayload,
} from '../data/mockTrackRecommendData';
import {
  MOCK_ROADMAP,
  type RoadmapPayload,
} from '../data/mockRoadmapData';

export type RecommendResult = {
  jobs: JobRecommendation[];
  trackRecommend: TrackRecommendPayload;
  roadmap: RoadmapPayload;
};

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

/**
 * 추천 결과 전체 조회 (API 연동 전 mock 반환)
 * - 실패 시 throw → ViewModel에서 catch → isError = true
 * - API 연동 시 아래 mock 블록을 실제 fetch로 교체
 */
export async function fetchRecommendResult(): Promise<RecommendResult> {
  // TODO: API 연동 시 아래 mock을 제거하고 실제 fetch로 교체
  // const res = await fetch(`${BASE_URL}/api/recommend`, {
  //   headers: { 'Content-Type': 'application/json' },
  // });
  // if (!res.ok) throw new Error(`추천 API 오류: ${res.status}`);
  // return res.json();

  void BASE_URL; // API 연동 전 lint 경고 억제

  return new Promise<RecommendResult>((resolve) => {
    setTimeout(() => {
      resolve({
        jobs: MOCK_JOB_RECOMMENDATIONS,
        trackRecommend: MOCK_TRACK_RECOMMEND,
        roadmap: MOCK_ROADMAP,
      });
    }, 800);
  });
}
