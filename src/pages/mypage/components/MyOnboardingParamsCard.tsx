import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { MySectionCard } from './MySectionCard';

interface ParamRowProps {
  label: string;
  value: string;
  showDivider?: boolean;
  onPressEdit: () => void;
}

function ParamRow({ label, value, showDivider = true, onPressEdit }: ParamRowProps) {
  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue} numberOfLines={2}>
          {value}
        </Text>
        <Pressable
          style={({ pressed }) => [styles.editCol, pressed && styles.editColPressed]}
          onPress={onPressEdit}
          hitSlop={6}
          accessibilityLabel={`${label} 수정`}
          accessibilityRole="button"
        >
          <Ionicons name="pencil" size={15} color="#14B8A6" />
        </Pressable>
      </View>
      {showDivider ? <View style={styles.divider} /> : null}
    </View>
  );
}

interface MyOnboardingParamsCardProps {
  gradeLabel: string;
  tracksOrAffiliationLabel: string;
  tracksOrAffiliationValue: string;
  interestsSummaryLine: string;
  developmentLine: string;
  experiencedLine: string;
  employmentLine: string;
  onPressEditGrade: () => void;
  onPressEditTracksOrAffiliation: () => void;
  onPressEditInterests: () => void;
  onPressEditDevelopment: () => void;
  onPressEditExperience: () => void;
  onPressEditEmployment: () => void;
}

export function MyOnboardingParamsCard({
  gradeLabel,
  tracksOrAffiliationLabel,
  tracksOrAffiliationValue,
  interestsSummaryLine,
  developmentLine,
  experiencedLine,
  employmentLine,
  onPressEditGrade,
  onPressEditTracksOrAffiliation,
  onPressEditInterests,
  onPressEditDevelopment,
  onPressEditExperience,
  onPressEditEmployment,
}: MyOnboardingParamsCardProps) {
  return (
    <View style={styles.wrap}>
      <MySectionCard title="내정보" iconName="person-outline">
        <ParamRow label="학년" value={gradeLabel} onPressEdit={onPressEditGrade} />
        <ParamRow
          label={tracksOrAffiliationLabel}
          value={tracksOrAffiliationValue}
          onPressEdit={onPressEditTracksOrAffiliation}
        />
        <ParamRow
          label="관심 분야"
          value={interestsSummaryLine}
          onPressEdit={onPressEditInterests}
        />
        <ParamRow
          label="흥미 개발 분야"
          value={developmentLine}
          onPressEdit={onPressEditDevelopment}
        />
        <ParamRow
          label="공부해본 분야"
          value={experiencedLine}
          onPressEdit={onPressEditExperience}
        />
        <ParamRow
          label="취업 선호"
          value={employmentLine}
          showDivider={false}
          onPressEdit={onPressEditEmployment}
        />
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
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 10,
  },
  editCol: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 1,
  },
  editColPressed: {
    opacity: 0.7,
  },
  rowLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    width: 88,
    paddingTop: 2,
  },
  rowValue: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    textAlign: 'right',
    fontWeight: '500',
    paddingRight: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
});
