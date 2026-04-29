import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { InterestChip } from './components/InterestChip';

type Props = StackScreenProps<OnboardingStackParamList, 'ExperiencedFieldSophomore'>;

const techTags = ['Python', 'Java', 'JavaScript', 'C/C++', 'SQL', 'React', 'Spring', 'Flutter'];

export function ExperiencedFieldSophomorePage({ navigation }: Props) {
  const selectedFields = useOnboardingStore((state) => state.experiencedFieldsSophomore);
  const toggleField = useOnboardingStore((state) => state.toggleExperiencedFieldSophomore);
  const fieldInput = useOnboardingStore((state) => state.experiencedFieldInputSophomore);
  const setFieldInput = useOnboardingStore((state) => state.setExperiencedFieldInputSophomore);

  const goNext = () => navigation.navigate('OnboardingConfirmSophomore');

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← 뒤로</Text>
          </Pressable>
          <Text style={styles.headerTitle}>2학년+ 흐름</Text>
        </View>

        <Text style={styles.screenId}>ON-SCR-07b | ON-011-1 [P2]</Text>
        <ProgressBar progress={0.84} />
        <Text style={styles.title}>공부해본 분야가 있나요?</Text>
        <Text style={styles.subtitle}>선택사항 — 건너뛰기 가능</Text>

        <TextInput
          style={styles.textInput}
          placeholder="예: Python, React, 데이터분석 등"
          placeholderTextColor="#AAAAAA"
          value={fieldInput}
          onChangeText={setFieldInput}
        />
        <View style={styles.chipGroup}>
          {techTags.map((tag) => (
            <InterestChip
              key={tag}
              label={tag}
              selected={selectedFields.includes(tag)}
              onPress={() => toggleField(tag)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomArea}>
        <Pressable style={styles.skipButton} onPress={goNext}>
          <Text style={styles.skipLabel}>건너뛰기</Text>
        </Pressable>
        <View style={styles.spacer} />
        <Button title="다음" variant="primary" onPress={goNext} />
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
  subtitle: { fontSize: 18, lineHeight: 26, color: '#737373', marginBottom: 20 },
  textInput: { backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: '#E5E5E5', paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#171717', marginBottom: 12 },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  bottomArea: { paddingTop: 12 },
  skipButton: { width: '100%', minHeight: 58, borderRadius: 14, backgroundColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' },
  skipLabel: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
  spacer: { height: 10 },
});
