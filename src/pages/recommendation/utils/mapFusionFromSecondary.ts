import type { SecondaryTrack, TrackSubjectRef } from '../../../data/mockTrackRecommendData';

export interface FusionCombo {
  id: string;
  major1: string;
  major2: string;
  job: string;
  reasoning: string;
  mainSubjects: TrackSubjectRef[];
}

const SPLIT_PATTERN = /\s*[×xX]\s*/;

export function parseFusionName(name: string): { major1: string; major2: string } {
  const parts = name.split(SPLIT_PATTERN).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return { major1: parts[0], major2: parts[1] };
  }
  return { major1: name, major2: '' };
}

export function selectFusionTracks(secondary: SecondaryTrack[]): SecondaryTrack[] {
  const cross = secondary.filter((t) => t.isCrossCombination);
  return cross.length > 0 ? cross : secondary;
}

export function mapFusionFromSecondary(secondary: SecondaryTrack[]): FusionCombo[] {
  return selectFusionTracks(secondary).map((track) => {
    const { major1, major2 } = parseFusionName(track.name);
    const job =
      major2 && major2 !== major1
        ? `${major1} × ${major2}`
        : major1;
    const reasoning =
      track.reasoning?.trim() ||
      (track.score != null ? `시너지 ${track.score}점 조합` : '추천 직무 탐색');

    return {
      id: track.id,
      major1,
      major2: major2 || major1,
      job,
      reasoning,
      mainSubjects: track.mainSubjects ?? [],
    };
  });
}
