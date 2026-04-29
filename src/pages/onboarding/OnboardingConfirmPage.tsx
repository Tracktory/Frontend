import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { colors } from '../../styles/colors';
import { useOnboardingStore } from '../../stores/onboardingStore';
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
    backgroundColor: '#F4F4F4',
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
    backgroundColor: '#00C9B1',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  empty: {
    fontSize: 14,
    color: colors.textHint,
  },
});

export function OnboardingConfirmPage({ navigation }: Props) {
  const admissionYear = useOnboardingStore((state) => state.admissionYear);
  const grade = useOnboardingStore((state) => state.grade);
  const affiliation = useOnboardingStore((state) => state.affiliation);
  const college = useOnboardingStore((state) => state.college);
  const track1 = useOnboardingStore((state) => state.track1);
  const track2 = useOnboardingStore((state) => state.track2);
  const interests = useOnboardingStore((state) => state.interests);
  const developmentFields = useOnboardingStore((state) => state.developmentFields);
  const preferredCompanyTypes = useOnboardingStore((state) => state.preferredCompanyTypes);
  const employmentValues = useOnboardingStore((state) => state.employmentValues);
  const experiencedFields = useOnboardingStore((state) => state.experiencedFields);
  const experiencedFieldInput = useOnboardingStore((state) => state.experiencedFieldInput);

  const admissionYearLabel =
    admissionYear && grade ? `${admissionYear}년 (${grade}학년)` : null;

  const inputTags = experiencedFieldInput
    ? experiencedFieldInput
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const allExperiencedFields = [...new Set([...inputTags, ...experiencedFields])];

  const employmentChips = [...preferredCompanyTypes, ...employmentValues];

  const handleSave = () => {
    console.log('[Onboarding] 저장하고 추천받기 클릭');
    console.log('[Onboarding] 최종 데이터:', {
      admissionYear,
      grade,
      affiliation,
      college,
      track1,
      track2,
      interests,
      developmentFields,
      preferredCompanyTypes,
      employmentValues,
      experiencedFields: allExperiencedFields,
    });
    navigation.navigate('RecommendLoading');
  };

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
      >
        <ProgressBar progress={1.0} />

        <Text style={styles.title}>
          <Text style={styles.titleHighlight}>이 내용이</Text>맞을까요?
        </Text>
        <Text style={styles.subtitle}>저장 후 AI가 맞춤 추천을 생성합니다</Text>

        {/* 입학년도 */}
        <ConfirmCard label="입학년도">
          {admissionYearLabel ? (
            <Text style={styles.valueText}>{admissionYearLabel}</Text>
          ) : (
            <Text style={cardStyles.empty}>선택 안 함</Text>
          )}
        </ConfirmCard>

        {/* 소속 — 1학년: 단과대, 2학년+: 트랙 */}
        {affiliation === '1학년' ? (
          <ConfirmCard label="소속">
            {college ? (
              <Text style={styles.valueText}>{college}</Text>
            ) : (
              <Text style={cardStyles.empty}>선택 안 함</Text>
            )}
          </ConfirmCard>
        ) : (
          <ConfirmCard label="소속">
            {track1 ? (
              <Text style={styles.valueText}>
                {track1}
                {track2 ? `  /  ${track2}` : ''}
              </Text>
            ) : (
              <Text style={cardStyles.empty}>선택 안 함</Text>
            )}
          </ConfirmCard>
        )}

        {/* 관심사 */}
        <ConfirmCard label="관심사">
          <ChipList items={interests} />
        </ConfirmCard>

        {/* 흥미 개발분야 */}
        <ConfirmCard label="흥미 개발분야">
          <ChipList items={developmentFields} />
        </ConfirmCard>

        {/* 취업 선호 */}
        <ConfirmCard label="취업 선호">
          <ChipList items={employmentChips} />
        </ConfirmCard>

        {/* 공부해본 분야 (선택사항) */}
        {allExperiencedFields.length > 0 && (
          <ConfirmCard label="공부해본 분야">
            <ChipList items={allExperiencedFields} />
          </ConfirmCard>
        )}
      </ScrollView>

      <View style={styles.bottomArea}>
        <SaveAndRecommendButton onPress={handleSave} />
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
  },
});
