/** 등반형 — 흰색 굽은 길 (변경 금지) */
export const WINDING_TRAIL_PATH =
  'M187 630 C 165 590, 148 555, 168 505 C 188 455, 210 425, 192 375 C 174 325, 158 290, 182 245 C 206 200, 198 175, 187 155';

/**
 * 학습 로드맵 → 현재 위치 → 직무 매칭 → 최종 역량
 * 끝점 = 노드 중심, 제어점 = WINDING_TRAIL_PATH 굴곡(우→좌→우) 참고
 */
export const JOURNEY_CLIMB_DASH_PATH =
  'M 192 425 C 210 405, 200 360, 192 330 C 174 325, 158 290, 187 245 C 206 200, 198 175, 187 155';

export const CLIMB_VIEWBOX = { width: 375, height: 740 };
export const EXPLORE_VIEWBOX = { width: 375, height: 500 };
