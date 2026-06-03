import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { JobRecommendation } from '../../../../data/mockRecommendData';
import type { NavigationProp } from '@react-navigation/native';
import type { MainStackParamList } from '../../../../navigation/MainStackNavigator';
import { colors } from '../../../../styles/colors';
import { JobCard } from '../JobCard';

interface JourneyJobMatchingSheetProps {
  jobs: JobRecommendation[];
  hasJobData: boolean;
  navigation: NavigationProp<MainStackParamList>;
  onSelectJob: (nav: NavigationProp<MainStackParamList>, id: string) => void;
}

export function JourneyJobMatchingSheet({
  jobs,
  hasJobData,
  navigation,
  onSelectJob,
}: JourneyJobMatchingSheetProps) {
  if (!hasJobData) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>데이터 추가 예정입니다</Text>
        <Text style={styles.emptySub}>곧 직무 추천 데이터가 업데이트됩니다</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          title={job.title}
          description={job.description}
          reasoning={job.reasoning}
          titleTrailing={job.matchScore > 0 ? `${job.matchScore}% 매칭` : undefined}
          chips={job.techStack}
          chipsReady={job.techStackReady}
          onPress={() => onSelectJob(navigation, job.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
    paddingBottom: 8,
  },
  empty: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptySub: {
    marginTop: 8,
    fontSize: 13,
    color: colors.textHint,
  },
});
