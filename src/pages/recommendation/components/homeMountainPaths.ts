/** 등반형 — 흰색 굽은 길 (변경 금지) */
export const WINDING_TRAIL_PATH =
  'M187 630 C 165 590, 148 555, 168 505 C 188 455, 210 425, 192 375 C 174 325, 158 290, 182 245 C 206 200, 198 175, 187 155';

/**
 * 학습 로드맵 → 현재 위치 → 직무 매칭 → 최종 역량 점선
 * 끝점 = JourneyLayout 노드 중심 (192,425) (220,330) (177,245) (187,155)
 * 트랙 시너지 구간 제외
 */
export const JOURNEY_CLIMB_DASH_PATH =
  'M 192 425 C 238 400, 248 365, 220 330 C 178 318, 142 292, 177 245 C 212 198, 208 168, 187 155';

export const CLIMB_VIEWBOX = { width: 375, height: 740 };
export const EXPLORE_VIEWBOX = { width: 375, height: 500 };
