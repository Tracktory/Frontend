import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { SaveAndRecommendButton } from './components/SaveAndRecommendButton';

type Props = StackScreenProps<OnboardingStackParamList, 'OnboardingConfirmSophomore'>;

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <View style={styles.valueRow}>{children}</View>
    </View>
  );
}

function ChipList({ items }: { items: string[] }) {
  if (items.length === 0) return <Text style={styles.empty}>선택 안 함</Text>;
  return (
    <>
      {items.map((item, idx) => (
        <View key={`${item}-${idx}`} style={styles.chip}>
          <Text style={styles.chipText}>{item}</Text>
        </View>
      ))}
    </>
  );
}

export function OnboardingConfirmSophomorePage({ navigation }: Props) {
  const admissionYear = useOnboardingStore((state) => state.admissionYear);
  const grade = useOnboardingStore((state) => state.grade);
  const track1 = useOnboardingStore((state) => state.track1);
  const track2 = useOnboardingStore((state) => state.track2);
  const interests = useOnboardingStore((state) => state.interestsSophomore);
  const developmentFields = useOnboardingStore((state) => state.developmentFieldsSophomore);
  const companyTypes = useOnboardingStore((state) => state.preferredCompanyTypesSophomore);
  const values = useOnboardingStore((state) => state.employmentValuesSophomore);
  const experiencedInput = useOnboardingStore((state) => state.experiencedFieldInputSophomore);
  const experiencedTags = useOnboardingStore((state) => state.experiencedFieldsSophomore);

  const inputTags = experiencedInput
    ? experiencedInput.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
    : [];
  const allExperienced = [...new Set([...inputTags, ...experiencedTags])];
  const admissionLabel = admissionYear && grade ? `${admissionYear}년 (${grade}학년)` : '선택 안 함';
  const trackLabel = track1
    ? `1트랙: ${track1}${track2 ? ` | 2트랙: ${track2}` : ''}`
    : '입력 안 함';

  const employmentMerged: { text: string; dot?: boolean }[] = [];
  companyTypes.forEach((v) => employmentMerged.push({ text: v }));
  if (companyTypes.length > 0 && values.length > 0) employmentMerged.push({ text: '•', dot: true });
  values.forEach((v) => employmentMerged.push({ text: v }));

  const handleSave = () => {
    console.log('[Onboarding] 2학년+ 저장하고 추천 받기 클릭');
    console.log('[Onboarding] 최종 데이터:', {
      admissionYear,
      grade,
      track1,
      track2,
      interests,
      developmentFields,
      companyTypes,
      values,
      experiencedFields: allExperienced,
    });
    navigation.navigate('RecommendLoading');
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← 뒤로</Text>
          </Pressable>
          <Text style={styles.headerTitle}>2학년+ 흐름</Text>
        </View>

        <Text style={styles.screenId}>ON-SCR-08b | ON-013</Text>
        <ProgressBar progress={1} />
        <Text style={styles.title}>입력 내용을 확인해주세요</Text>
        <Text style={styles.subtitle}>저장 후 AI가 맞춤 추천을 생성합니다</Text>

        <Card label="입학년도"><Text style={styles.valueText}>{admissionLabel}</Text></Card>
        <Card label="트랙"><Text style={styles.valueText}>{trackLabel}</Text></Card>
        <Card label="관심사"><ChipList items={interests} /></Card>
        <Card label="흥미 개발분야"><ChipList items={developmentFields} /></Card>
        <Card label="취업 선호">
          {employmentMerged.length === 0 ? (
            <Text style={styles.empty}>선택 안 함</Text>
          ) : (
            employmentMerged.map((item, idx) =>
              item.dot ? (
                <Text key={`dot-${idx}`} style={styles.dot}>•</Text>
              ) : (
                <View key={`${item.text}-${idx}`} style={styles.chip}>
                  <Text style={styles.chipText}>{item.text}</Text>
                </View>
              )
            )
          )}
        </Card>
        <Card label="공부해본 분야"><ChipList items={allExperienced} /></Card>
      </ScrollView>

      <View style={styles.bottomArea}>
        <SaveAndRecommendButton onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3F4F6', paddingHorizontal: 20, paddingTop: 48, paddingBottom: 28 },
  scrollArea: { flex: 1 },
  content: { paddingBottom: 16 },
  headerRow: { minHeight: 44, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ECECEC', marginBottom: 10 },
  backButton: { paddingVertical: 8, paddingRight: 12 },
  backButtonText: { fontSize: 18, fontWeight: '500', color: '#333333' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#333333', marginLeft: 8 },
  screenId: { fontSize: 12, color: '#A3A3A3', marginBottom: 8, fontWeight: '500' },
  title: { fontSize: 36, lineHeight: 44, fontWeight: '700', color: '#171717', marginBottom: 8 },
  subtitle: { fontSize: 18, lineHeight: 26, color: '#737373', marginBottom: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 12 },
  cardLabel: { fontSize: 13, color: '#A3A3A3', marginBottom: 8 },
  valueRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  valueText: { fontSize: 16, fontWeight: '600', color: '#171717' },
  chip: { backgroundColor: '#F0F0F0', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 14, color: '#333333', fontWeight: '500' },
  empty: { fontSize: 14, color: '#C4C4C4' },
  dot: { fontSize: 14, color: '#A3A3A3', marginHorizontal: 2 },
  bottomArea: { paddingTop: 12 },
});
