import React, { useEffect, useState } from 'react';
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
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    topJobs[0]?.id ?? null
  );

  useEffect(() => {
    setSelectedJobId(jobs.slice(0, MAX_JOBS)[0]?.id ?? null);
  }, [jobs]);

  return (
    <View style={styles.wrap}>
      {topJobs.map((job) => (
        <JobMatchingCard
          key={job.id}
          title={job.title}
          matchScore={job.matchScore}
          chips={job.techStackReady ? job.techStack : []}
          reasoning={job.reasoning}
          isActive={job.id === selectedJobId}
          onPress={() => setSelectedJobId(job.id)}
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
