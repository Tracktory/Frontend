import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../styles/colors';

interface RowProps {
  label: string;
  value: string;
  showDivider: boolean;
  onEdit: () => void;
}

function Row({ label, value, showDivider, onEdit }: RowProps) {
  return (
    <View>
      <View style={styles.rowInner}>
        <View style={styles.rowTextWrap}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
        <Pressable
          hitSlop={8}
          onPress={onEdit}
          style={({ pressed }) => [styles.editButton, pressed && styles.hitPressed]}
        >
          <Ionicons name="create-outline" size={18} color={colors.primary} />
        </Pressable>
      </View>
      {showDivider ? <View style={styles.divider} /> : null}
    </View>
  );
}

interface MyOnboardingInfoCardProps {
  interestsLine: string;
  developmentLine: string;
  employmentLine: string;
  onEditInterests: () => void;
  onEditDevelopment: () => void;
  onEditEmployment: () => void;
}

export function MyOnboardingInfoCard({
  interestsLine,
  developmentLine,
  employmentLine,
  onEditInterests,
  onEditDevelopment,
  onEditEmployment,
}: MyOnboardingInfoCardProps) {
  return (
    <>
      <Text style={styles.sectionTitle}>내 정보</Text>
      <View style={styles.card}>
        <Row
          label="관심사"
          value={interestsLine}
          showDivider
          onEdit={onEditInterests}
        />
        <Row
          label="흥미 개발 분야"
          value={developmentLine}
          showDivider
          onEdit={onEditDevelopment}
        />
        <Row
          label="취업 선호도"
          value={employmentLine}
          showDivider={false}
          onEdit={onEditEmployment}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
    marginBottom: 22,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  rowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  rowTextWrap: {
    flex: 1,
    paddingRight: 8,
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: colors.textHint,
    fontWeight: '400',
  },
  value: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
    lineHeight: 20,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginLeft: 12,
    marginRight: 12,
  },
  editButton: {
    width: 34,
    height: 34,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  hitPressed: {
    opacity: 0.6,
  },
});
