import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { colors } from '../../styles/colors';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { InterestChip } from './components/InterestChip';
import { INTEREST_OPTIONS } from './data/onboardingOptions';

type Props = StackScreenProps<OnboardingStackParamList, 'InterestSelect'>;

export function InterestSelectPage({ navigation }: Props) {
  const selectedInterests = useOnboardingStore((state) => state.interests);
  const toggleInterest = useOnboardingStore((state) => state.toggleInterest);

  const maxReached = selectedInterests.length >= 5;
  const canProceed = selectedInterests.length >= 1;

  const handleToggleInterest = (interest: string) => {
    const alreadySelected = selectedInterests.includes(interest);
    if (!alreadySelected && maxReached) return;
    toggleInterest(interest);
  };

  const handleNext = () => {
    if (!canProceed) return;
    console.log('[Onboarding] 선택한 관심사:', selectedInterests);
    navigation.navigate('DevelopmentFieldSelect');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <ProgressBar progress={0.42} />

        <Text style={styles.title}>
          <Text style={styles.titleHighlight}>관심분야</Text>를 선택해주세요
        </Text>
        <Text style={styles.subtitle}>최대 5개까지 선택가능</Text>

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
      </View>

      <View style={styles.bottomArea}>
        <Button
          title="다음 단계로"
          variant={canProceed ? 'primary' : 'disabled'}
          onPress={handleNext}
          subtitle={canProceed ? undefined : '관심분야를 선택해주세요'}
        />
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
  content: {
    flex: 1,
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
    marginBottom: 24,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  bottomArea: {
    paddingTop: 12,
  },
});
