import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { InterestChip } from './components/InterestChip';
import { DEVELOPMENT_FIELD_OPTIONS } from './data/onboardingOptions';

type Props = StackScreenProps<OnboardingStackParamList, 'DevelopmentFieldSelect'>;

export function DevelopmentFieldSelectPage({ navigation }: Props) {
  const selectedFields = useOnboardingStore((state) => state.developmentFields);
  const toggleField = useOnboardingStore((state) => state.toggleDevelopmentField);
  const maxReached = selectedFields.length >= 3;

  const handleToggleField = (field: string) => {
    const alreadySelected = selectedFields.includes(field);
    if (!alreadySelected && maxReached) {
      console.log('[Onboarding] 흥미 개발분야는 최대 3개까지 선택할 수 있습니다.');
      return;
    }
    toggleField(field);
  };

  const handleNext = () => {
    if (selectedFields.length < 1) return;
    console.log('[Onboarding] 선택한 흥미 개발분야:', selectedFields);
    navigation.navigate('EmploymentPreference');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← 뒤로</Text>
          </Pressable>
        </View>

        <ProgressBar progress={0.56} />

        <Text style={styles.title}>흥미있는 개발 분야를 선택해주세요</Text>
        <Text style={styles.subtitle}>1~3개 선택</Text>

        <View style={styles.chipGroup}>
          {DEVELOPMENT_FIELD_OPTIONS.map((field) => {
            const isSelected = selectedFields.includes(field);
            return (
              <InterestChip
                key={field}
                label={field}
                selected={isSelected}
                disabled={maxReached && !isSelected}
                onPress={() => handleToggleField(field)}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.bottomArea}>
        <Button
          title={selectedFields.length > 0 ? '다음' : '다음 (흥미 개발분야를 선택해주세요)'}
          variant={selectedFields.length > 0 ? 'primary' : 'disabled'}
          onPress={handleNext}
        />
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
  content: { flex: 1 },
  headerRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    marginBottom: 10,
  },
  backButton: { paddingVertical: 8, paddingRight: 12 },
  backButtonText: { fontSize: 18, fontWeight: '500', color: '#333333' },
  title: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 8,
  },
  subtitle: { fontSize: 22, lineHeight: 30, color: '#737373', marginBottom: 20 },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  bottomArea: { paddingTop: 12 },
});
