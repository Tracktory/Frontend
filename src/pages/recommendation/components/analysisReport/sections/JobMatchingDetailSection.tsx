import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { ReportJobItem } from '../../../utils/buildAnalysisReportModel';
import { AnalysisReportSection } from '../AnalysisReportSection';
import { ReportAccordion } from '../shared/ReportAccordion';
import { SkillChip } from '../shared/SkillChip';

const REASONING_PLACEHOLDER = '추천 근거가 준비 중이에요.';

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
      {jobs.map((job, i) => {
        const reasoning = job.reasoning.trim() || REASONING_PLACEHOLDER;
        const techChips = job.techStack;
        const skillChips = [...job.coreSkills, ...job.advancedSkills].slice(0, 8);

        return (
          <ReportAccordion
            key={job.jobCode ?? job.id}
            expanded={expandedJob === i}
            onToggle={() => setExpandedJob(expandedJob === i ? null : i)}
            header={
              <View style={styles.jobHeaderRow}>
                <Text style={styles.jobTitle} numberOfLines={2}>
                  {job.title}
                </Text>
                {job.match > 0 ? (
                  <View style={styles.matchPill}>
                    <Text style={styles.matchText}>{job.match}% 매칭</Text>
                  </View>
                ) : null}
              </View>
            }
          >
            {job.description.trim() ? (
              <Text style={styles.description}>{job.description}</Text>
            ) : null}
            <Text style={styles.reasoning}>{reasoning}</Text>
            {techChips.length > 0 ? (
              <>
                <Text style={styles.chipsTitle}>기술 스택</Text>
                <View style={styles.chipRow}>
                  {techChips.map((chip) => (
                    <SkillChip key={chip} label={chip} variant="skill" />
                  ))}
                </View>
              </>
            ) : null}
            {skillChips.length > 0 ? (
              <>
                <Text style={styles.chipsTitle}>필요 역량</Text>
                <View style={styles.chipRow}>
                  {skillChips.map((chip) => (
                    <SkillChip key={chip} label={chip} variant="token" />
                  ))}
                </View>
              </>
            ) : null}
          </ReportAccordion>
        );
      })}
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
    paddingRight: 8,
  },
  jobTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  matchPill: {
    backgroundColor: '#14B8A6',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  reasoning: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  chipsTitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 6,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
});
