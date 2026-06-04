export function computeJourneyMode(params: {
  studentYear: number;
  hasSelectedTrack: boolean;
}): { isExploring: boolean; showFullMountainBackground: boolean } {
  const { studentYear, hasSelectedTrack } = params;
  const isExploring = studentYear === 1 || !hasSelectedTrack;
  return {
    isExploring,
    showFullMountainBackground: !isExploring,
  };
}
