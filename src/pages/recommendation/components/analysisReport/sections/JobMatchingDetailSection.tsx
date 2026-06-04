import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ReportJobItem } from '../../../utils/buildAnalysisReportModel';
import { AnalysisReportSection } from '../AnalysisReportSection';
import { ReportAccordion } from '../shared/ReportAccordion';
import { SkillChip } from '../shared/SkillChip';

interface JobMatchingDetailSectionProps {
  jobs: ReportJobItem[];
  onSelectJobCode?: (jobCode: string) => void;
}

export function JobMatchingDetailSection({
  jobs,
  onSelectJobCode,
}: JobMatchingDetailSectionProps) {
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
      <Text style={styles.hint}>카드를 탭하면 해당 직무 기준으로 충족도를 볼 수 있어요.</Text>
      {jobs.map((job, i) => (
        <ReportAccordion
          key={job.jobCode ?? job.id}
          expanded={expandedJob === i}
          onToggle={() => setExpandedJob(expandedJob === i ? null : i)}
          borderActive={job.isAnchor}
          header={
            <Pressable
              style={styles.jobHeaderPress}
              onPress={() => {
                if (job.jobCode && onSelectJobCode) {
                  onSelectJobCode(job.jobCode);
                }
              }}
            >
              <View style={styles.jobHeaderRow}>
                <Text style={styles.icon}>{job.icon}</Text>
                <View style={styles.jobHeaderText}>
                  <View style={styles.titleRow}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    {job.isAnchor ? (
                      <View style={styles.anchorBadge}>
                        <Text style={styles.anchorBadgeText}>기준</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.salary}>연봉 {job.salary}</Text>
                </View>
                <View style={styles.matchPill}>
                  <Text style={styles.matchText}>{job.match}%</Text>
                </View>
              </View>
            </Pressable>
          }
        >
          <View style={styles.matchBarWrap}>
            <View style={styles.matchBarLabels}>
              <Text style={styles.matchBarLabel}>현재 충족률</Text>
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
          {job.jobCode && onSelectJobCode ? (
            <Pressable
              style={styles.setAnchorBtn}
              onPress={() => onSelectJobCode(job.jobCode!)}
            >
              <Text style={styles.setAnchorText}>이 직무를 기준으로 보기</Text>
            </Pressable>
          ) : null}
        </ReportAccordion>
      ))}
    </AnalysisReportSection>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 10,
  },
  empty: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  jobHeaderPress: {
    flex: 1,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  anchorBadge: {
    backgroundColor: '#CCFBF1',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  anchorBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D9488',
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
  setAnchorBtn: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  setAnchorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D9488',
  },
});
