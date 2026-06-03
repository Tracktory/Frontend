import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { ReportJobItem } from '../../../utils/buildAnalysisReportModel';
import { AnalysisReportSection } from '../AnalysisReportSection';
import { ReportAccordion } from '../shared/ReportAccordion';
import { SkillChip } from '../shared/SkillChip';

interface JobMatchingDetailSectionProps {
  jobs: ReportJobItem[];
}

export function JobMatchingDetailSection({ jobs }: JobMatchingDetailSectionProps) {
  const [expandedJob, setExpandedJob] = useState<number | null>(0);

  if (jobs.length === 0) {
    return (
      <AnalysisReportSection title="직무 매칭 상세" iconName="briefcase">
        <Text style={styles.empty}>추천 직무 데이터가 없습니다.</Text>
      </AnalysisReportSection>
    );
  }

  return (
    <AnalysisReportSection title="직무 매칭 상세" iconName="briefcase">
      {jobs.map((job, i) => (
        <ReportAccordion
          key={job.id}
          expanded={expandedJob === i}
          onToggle={() => setExpandedJob(expandedJob === i ? null : i)}
          borderActive
          header={
            <View style={styles.jobHeaderRow}>
              <Text style={styles.icon}>{job.icon}</Text>
              <View style={styles.jobHeaderText}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.salary}>연봉 {job.salary}</Text>
              </View>
              <View style={styles.matchPill}>
                <Text style={styles.matchText}>{job.match}%</Text>
              </View>
            </View>
          }
        >
          <View style={styles.matchBarWrap}>
            <View style={styles.matchBarLabels}>
              <Text style={styles.matchBarLabel}>직무 매칭률</Text>
              <Text style={styles.matchBarValue}>{job.match}%</Text>
            </View>
            <View style={styles.matchBarTrack}>
              <View style={[styles.matchBarFill, { width: `${job.match}%` }]} />
            </View>
          </View>
          <Text style={styles.chipsTitle}>보유 스킬</Text>
          <View style={styles.chipRow}>
            {job.skills.map((s) => (
              <SkillChip key={s} label={s} variant="owned" />
            ))}
          </View>
          <Text style={[styles.chipsTitle, styles.gapTitle]}>필요 역량</Text>
          <View style={styles.chipRow}>
            {job.gap.map((s) => (
              <SkillChip key={s} label={s} variant="gap" />
            ))}
          </View>
        </ReportAccordion>
      ))}
    </AnalysisReportSection>
  );
}

const styles = StyleSheet.create({
  empty: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  jobHeaderRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 22,
  },
  jobHeaderText: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  salary: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  matchPill: {
    backgroundColor: '#14B8A6',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 4,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  matchBarWrap: {
    marginBottom: 12,
  },
  matchBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  matchBarLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  matchBarValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#14B8A6',
  },
  matchBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCFBF1',
    overflow: 'hidden',
  },
  matchBarFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#14B8A6',
  },
  chipsTitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  gapTitle: {
    marginTop: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
});
