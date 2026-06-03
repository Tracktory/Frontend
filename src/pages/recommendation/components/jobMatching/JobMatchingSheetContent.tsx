import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { JobRecommendation } from '../../../../data/mockRecommendData';
import { JobBriefingLinkCard } from './JobBriefingLinkCard';
import { JobMatchingCard } from './JobMatchingCard';

const MAX_JOBS = 3;

interface JobMatchingSheetContentProps {
  jobs: JobRecommendation[];
  onShowBriefing: () => void;
}

export function JobMatchingSheetContent({
  jobs,
  onShowBriefing,
}: JobMatchingSheetContentProps) {
  const topJobs = jobs.slice(0, MAX_JOBS);

  return (
    <View style={styles.wrap}>
      {topJobs.map((job) => (
        <JobMatchingCard
          key={job.id}
          title={job.title}
          matchScore={job.matchScore}
          chips={job.techStackReady ? job.techStack : []}
        />
      ))}
      <JobBriefingLinkCard onPress={onShowBriefing} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
    paddingBottom: 8,
  },
});
