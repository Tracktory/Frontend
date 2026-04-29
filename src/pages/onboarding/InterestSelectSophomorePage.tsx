import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { InterestChip } from './components/InterestChip';
import { INTEREST_OPTIONS } from './constants';

type Props = StackScreenProps<OnboardingStackParamList, 'InterestSelectSophomore'>;

export function InterestSelectSophomorePage({ navigation }: Props) {
  const selectedInterests = useOnboardingStore((state) => state.interestsSophomore);
  const toggleInterest = useOnboardingStore((state) => state.toggleInterestSophomore);
  const maxReached = selectedInterests.length >= 5;

  const handleToggleInterest = (interest: string) => {
    const alreadySelected = selectedInterests.includes(interest);
    if (!alreadySelected && maxReached) {
      console.log('[Onboarding] 2학년+ 관심사는 최대 5개까지 선택할 수 있습니다.');
      return;
    }
    toggleInterest(interest);
  };

  const handleNext = () => {
    if (selectedInterests.length < 1) return;
    console.log('[Onboarding] 2학년+ 선택한 관심사:', selectedInterests);
    navigation.navigate('DevelopmentFieldSelectSophomore');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← 뒤로</Text>
          </Pressable>
          <Text style={styles.headerTitle}>2학년+ 흐름</Text>
        </View>

        <Text style={styles.screenId}>ON-SCR-04b | ON-007</Text>
        <ProgressBar progress={0.42} />

        <Text style={styles.title}>관심있는 분야를 선택해주세요</Text>
        <Text style={styles.subtitle}>1~5개 선택 가능</Text>

        <View style={styles.chipGroup}>
          {INTEREST_OPTIONS.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <InterestChip
                key={interest}
                label={interest}
                selected={isSelected}
                disabled={maxReached && !isSelected}
                onPress={() => handleToggleInterest(interest)}
              />
            );
          })}
        </View>

        <Text style={styles.counterText}>선택됨: {selectedInterests.length}/5</Text>
      </View>

      <View style={styles.bottomArea}>
        <Button
          title={selectedInterests.length > 0 ? '다음' : '다음 (관심사를 선택해주세요)'}
          variant={selectedInterests.length > 0 ? 'primary' : 'disabled'}
          onPress={handleNext}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3F4F6', paddingHorizontal: 20, paddingTop: 48, paddingBottom: 28 },
  content: { flex: 1 },
  headerRow: { minHeight: 44, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ECECEC', marginBottom: 10 },
  backButton: { paddingVertical: 8, paddingRight: 12 },
  backButtonText: { fontSize: 18, fontWeight: '500', color: '#333333' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#333333', marginLeft: 8 },
  screenId: { fontSize: 12, color: '#A3A3A3', marginBottom: 8, fontWeight: '500' },
  title: { fontSize: 36, lineHeight: 44, fontWeight: '700', color: '#171717', marginBottom: 8 },
  subtitle: { fontSize: 22, lineHeight: 30, color: '#737373', marginBottom: 20 },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  counterText: { fontSize: 14, color: '#737373' },
  bottomArea: { paddingTop: 12 },
});
