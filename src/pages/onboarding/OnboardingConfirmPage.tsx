import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { colors } from '../../styles/colors';
import { useOnboardingConfirmViewModel } from '../../hooks/useOnboardingConfirmViewModel';
import { SaveAndRecommendButton } from './components/SaveAndRecommendButton';

type Props = StackScreenProps<OnboardingStackParamList, 'OnboardingConfirm'>;

function ConfirmCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={cardStyles.card}>
      <Text style={cardStyles.label}>{label}</Text>
      <View style={cardStyles.valueRow}>{children}</View>
    </View>
  );
}

function ChipList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <Text style={cardStyles.empty}>선택 안 함</Text>;
  }
  return (
    <>
      {items.map((item) => (
        <View key={item} style={cardStyles.chip}>
          <Text style={cardStyles.chipText}>{item}</Text>
        </View>
      ))}
    </>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.chipSurface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: colors.textHint,
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  chip: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    fontSize: 13,
    color: colors.white,
    fontWeight: '500',
  },
  empty: {
    fontSize: 14,
    color: colors.textHint,
  },
});

export function OnboardingConfirmPage({ navigation }: Props) {
  const vm = useOnboardingConfirmViewModel(navigation);

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
      >
        <ProgressBar progress={1.0} />

        <Text style={styles.title}>
          <Text style={styles.titleHighlight}>이 내용이</Text>맞을까요?
        </Text>
        <Text style={styles.subtitle}>저장 후 AI가 맞춤 추천을 생성합니다</Text>

        <ConfirmCard label="입학년도">
          {vm.admissionYearLabel ? (
            <Text style={styles.valueText}>{vm.admissionYearLabel}</Text>
          ) : (
            <Text style={cardStyles.empty}>선택 안 함</Text>
          )}
        </ConfirmCard>

        {vm.affiliation === '1학년' ? (
          <ConfirmCard label="소속">
            {vm.college ? (
              <Text style={styles.valueText}>{vm.college}</Text>
            ) : (
              <Text style={cardStyles.empty}>선택 안 함</Text>
            )}
          </ConfirmCard>
        ) : (
          <ConfirmCard label="소속">
            {vm.track1 ? (
              <Text style={styles.valueText}>
                {vm.track1}
                {vm.track2 ? `  /  ${vm.track2}` : ''}
              </Text>
            ) : (
              <Text style={cardStyles.empty}>선택 안 함</Text>
            )}
          </ConfirmCard>
        )}

        <ConfirmCard label="관심사">
          <ChipList items={vm.interests} />
        </ConfirmCard>

        <ConfirmCard label="흥미 개발분야">
          <ChipList items={vm.developmentFields} />
        </ConfirmCard>

        <ConfirmCard label="취업 선호">
          <ChipList items={vm.employmentChips} />
        </ConfirmCard>

        {vm.allExperiencedFields.length > 0 && (
          <ConfirmCard label="공부해본 분야">
            <ChipList items={vm.allExperiencedFields} />
          </ConfirmCard>
        )}
      </ScrollView>

      <View style={styles.bottomArea}>
        <SaveAndRecommendButton onPress={vm.handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 28,
  },
  headerRow: {
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: 4,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  scrollArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  titleHighlight: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  valueText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  bottomArea: {
    paddingTop: 12,
    paddingBottom: 8,
  },
});
