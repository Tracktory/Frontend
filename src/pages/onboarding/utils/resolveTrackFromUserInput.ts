import {
  ALL_TRACK_OPTIONS,
  normalizeTrackName,
} from '../data/onboardingOptions';

/** 매칭용: 공백·트랙 접미사 제거, 표기 통일 */
function normalizeForMatch(raw: string): string {
  const base = normalizeTrackName(raw.trim()).replace(/\s+/g, '');
  return base.replace(/트랙$/i, '').toLowerCase();
}

function trackCore(canonical: string): string {
  return normalizeForMatch(canonical);
}

type MatchTier = 0 | 1 | 2 | 3;

function matchTier(query: string, canonical: string): MatchTier | null {
  const q = normalizeForMatch(query);
  const full = normalizeForMatch(canonical);
  const core = trackCore(canonical);

  if (!q) return null;
  if (full === q || `${core}트랙` === q || core === q) return 0;
  if (full.startsWith(q) || core.startsWith(q)) return 1;
  if (core.includes(q) || q.includes(core)) return 2;
  if (full.includes(q)) return 3;
  return null;
}

/**
 * 사용자 입력을 canonical 트랙명으로 변환.
 * 모호하면 ALL_TRACK_OPTIONS 정렬 순서상 첫 매칭을 사용.
 */
export function resolveTrackFromUserInput(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let best: { track: string; tier: MatchTier } | null = null;

  for (const track of ALL_TRACK_OPTIONS) {
    const tier = matchTier(trimmed, track);
    if (tier == null) continue;

    if (best == null || tier < best.tier) {
      best = { track, tier };
    }
  }

  return best?.track ?? null;
}
