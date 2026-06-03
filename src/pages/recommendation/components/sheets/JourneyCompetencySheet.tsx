import React from 'react';

import type { RoadmapPayload } from '../../../../data/mockRoadmapData';
import { CompetencyCoverageSheetContent } from '../competency/CompetencyCoverageSheetContent';

interface JourneyCompetencySheetProps {
  roadmap: RoadmapPayload | null;
  completedCourses: string[];
  onShowReport: () => void;
}

export function JourneyCompetencySheet({
  roadmap,
  completedCourses,
  onShowReport,
}: JourneyCompetencySheetProps) {
  return (
    <CompetencyCoverageSheetContent
      roadmap={roadmap}
      completedCourses={completedCourses}
      onShowReport={onShowReport}
    />
  );
}
