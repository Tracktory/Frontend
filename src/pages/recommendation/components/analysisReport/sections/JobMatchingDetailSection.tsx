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
                <View style={styles.jobHeaderText}>
                  <View style={styles.titleRow}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    {job.isAnchor ? (
                      <View style={styles.anchorBadge}>
                        <Text style={styles.anchorBadgeText}>기준</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                <View style={styles.matchPillWrap}>
                  <Text style={styles.matchPillLabel}>매칭</Text>
                  <View style={styles.matchPill}>
                    <Text style={styles.matchText}>{job.match}%</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          }
        >
          <View style={styles.matchBarWrap}>
            <View style={styles.matchBarLabels}>
              <Text style={styles.matchBarLabel}>역량 충족률</Text>
              <Text style={styles.matchBarValue}>{job.coveragePercent}%</Text>
            </View>
            <View style={styles.matchBarTrack}>
              <View
                style={[styles.matchBarFill, { width: `${job.coveragePercent}%` }]}
              />
            </View>
          </View>
          <Text style={styles.chipsTitle}>부족 역량 토큰</Text>
          {job.gapTokens.length > 0 ? (
            <View style={styles.chipRow}>
              {job.gapTokens.map((token) => (
                <SkillChip key={token} label={token} variant="token" />
              ))}
            </View>
          ) : (
            <Text style={styles.gapEmpty}>표시할 부족 역량 토큰이 없습니다.</Text>
          )}
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
  matchPillWrap: {
    alignItems: 'center',
    marginRight: 4,
  },
  matchPillLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    marginBottom: 2,
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
  gapEmpty: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
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
