import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MySectionCard } from './MySectionCard';

interface ParamRowProps {
  label: string;
  value: string;
  showDivider?: boolean;
}

function ParamRow({ label, value, showDivider = true }: ParamRowProps) {
  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue} numberOfLines={2}>
          {value}
        </Text>
      </View>
      {showDivider ? <View style={styles.divider} /> : null}
    </View>
  );
}

interface MyOnboardingParamsCardProps {
  admissionYearLabel: string;
  tracksOrAffiliationLabel: string;
  tracksOrAffiliationValue: string;
  jobPreferenceLine: string;
  interestsSummaryLine: string;
  onPressEditInfo: () => void;
}

export function MyOnboardingParamsCard({
  admissionYearLabel,
  tracksOrAffiliationLabel,
  tracksOrAffiliationValue,
  jobPreferenceLine,
  interestsSummaryLine,
  onPressEditInfo,
}: MyOnboardingParamsCardProps) {
  return (
    <View style={styles.wrap}>
      <MySectionCard title="온보딩 파라미터" iconName="book-outline">
        <ParamRow label="입학 학번" value={admissionYearLabel} />
        <ParamRow label={tracksOrAffiliationLabel} value={tracksOrAffiliationValue} />
        <ParamRow label="희망 직무" value={jobPreferenceLine} />
        <ParamRow label="관심 분야" value={interestsSummaryLine} showDivider={false} />
        <Pressable
          style={({ pressed }) => [styles.editBtn, pressed && styles.editBtnPressed]}
          onPress={onPressEditInfo}
        >
          <Text style={styles.editBtnText}>정보 수정</Text>
        </Pressable>
      </MySectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
  },
  rowLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    flex: 0.4,
  },
  rowValue: {
    fontSize: 13,
    color: '#374151',
    flex: 0.6,
    textAlign: 'right',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  editBtn: {
    marginTop: 12,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  editBtnPressed: {
    opacity: 0.7,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#14B8A6',
  },
});
