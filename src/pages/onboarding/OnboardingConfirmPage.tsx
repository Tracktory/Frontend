import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';

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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: '#A3A3A3',
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  chip: {
    backgroundColor: '#F0F0F0',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  empty: {
    fontSize: 14,
    color: '#C4C4C4',
  },
});

export function OnboardingConfirmPage({ navigation }: Props) {
  const admissionYear = useOnboardingStore((state) => state.admissionYear);
  const grade = useOnboardingStore((state) => state.grade);
  const college = useOnboardingStore((state) => state.college);
  const interests = useOnboardingStore((state) => state.interests);
  const preferredCompanyTypes = useOnboardingStore((state) => state.preferredCompanyTypes);
  const employmentValues = useOnboardingStore((state) => state.employmentValues);
  const experiencedFields = useOnboardingStore((state) => state.experiencedFields);
  const experiencedFieldInput = useOnboardingStore((state) => state.experiencedFieldInput);

  const admissionYearLabel =
    admissionYear && grade ? `${admissionYear}년 (${grade}학년)` : null;

  // 텍스트 입력값을 쉼표로 파싱해 칩 배열과 합치기
  const inputTags = experiencedFieldInput
    ? experiencedFieldInput
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const allExperiencedFields = [
    ...new Set([...inputTags, ...experiencedFields]),
  ];

  // 취업 선호: 회사 유형 + 구분자 + 가치
  const employmentPreferenceChips: { text: string; isDot?: boolean }[] = [];
  preferredCompanyTypes.forEach((t) => employmentPreferenceChips.push({ text: t }));
  if (preferredCompanyTypes.length > 0 && employmentValues.length > 0) {
    employmentPreferenceChips.push({ text: '•', isDot: true });
  }
  employmentValues.forEach((v) => employmentPreferenceChips.push({ text: v }));

  const handleSave = () => {
    console.log('[Onboarding] 저장하고 추천 받기 클릭');
    console.log('[Onboarding] 최종 데이터:', {
      admissionYear,
      grade,
      college,
      interests,
      preferredCompanyTypes,
      employmentValues,
      experiencedFields: allExperiencedFields,
    });
    navigation.navigate('RecommendLoading');
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← 뒤로</Text>
          </Pressable>
          <Text style={styles.headerTitle}>1학년 흐름</Text>
        </View>

        <Text style={styles.screenId}>ON-SCR-08a | ON-013</Text>
        <ProgressBar progress={1.0} />

        <Text style={styles.title}>입력 내용을 확인해주세요</Text>
        <Text style={styles.subtitle}>저장 후 AI가 맞춤 추천을 생성합니다</Text>

        {/* 입학년도 */}
        <ConfirmCard label="입학년도">
          {admissionYearLabel ? (
            <Text style={styles.valueText}>{admissionYearLabel}</Text>
          ) : (
            <Text style={cardStyles.empty}>선택 안 함</Text>
          )}
        </ConfirmCard>

        {/* 소속 */}
        <ConfirmCard label="소속">
          {college ? (
            <Text style={styles.valueText}>{college}</Text>
          ) : (
            <Text style={cardStyles.empty}>선택 안 함</Text>
          )}
        </ConfirmCard>

        {/* 관심사 */}
        <ConfirmCard label="관심사">
          <ChipList items={interests} />
        </ConfirmCard>

        {/* 취업 선호 */}
        <ConfirmCard label="취업 선호">
          {employmentPreferenceChips.length === 0 ? (
            <Text style={cardStyles.empty}>선택 안 함</Text>
          ) : (
            employmentPreferenceChips.map((item, idx) =>
              item.isDot ? (
                <Text key={`dot-${idx}`} style={styles.dotSeparator}>
                  {item.text}
                </Text>
              ) : (
                <View key={`${item.text}-${idx}`} style={cardStyles.chip}>
                  <Text style={cardStyles.chipText}>{item.text}</Text>
                </View>
              )
            )
          )}
        </ConfirmCard>

        {/* 공부해본 분야 */}
        <ConfirmCard label="공부해본 분야">
          <ChipList items={allExperiencedFields} />
        </ConfirmCard>
      </ScrollView>

      <View style={styles.bottomArea}>
        <Button title="저장하고 추천 받기" variant="primary" onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 28,
  },
  scrollArea: {
    flex: 1,
  },
  content: {
    paddingBottom: 16,
  },
  headerRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    marginBottom: 10,
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 12,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
  },
  screenId: {
    fontSize: 12,
    color: '#A3A3A3',
    marginBottom: 8,
    fontWeight: '500',
  },
  title: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
    color: '#737373',
    marginBottom: 24,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
  },
  dotSeparator: {
    fontSize: 14,
    color: '#A3A3A3',
    marginHorizontal: 2,
  },
  bottomArea: {
    paddingTop: 12,
  },
});
