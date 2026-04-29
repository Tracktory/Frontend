import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { colors } from '../../styles/colors';
import { useOnboardingStore } from '../../stores/onboardingStore';

type Props = StackScreenProps<OnboardingStackParamList, 'TrackInput'>;

export function TrackInputPage({ navigation }: Props) {
  const track1 = useOnboardingStore((state) => state.track1);
  const track2 = useOnboardingStore((state) => state.track2);
  const setTrack1 = useOnboardingStore((state) => state.setTrack1);
  const setTrack2 = useOnboardingStore((state) => state.setTrack2);

  const canProceed = track1.trim().length > 0;

  const handleNext = () => {
    if (!canProceed) return;
    navigation.navigate('InterestSelect');
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
          <Text style={styles.titleHighlight}>트랙정보</Text>를 입력해주세요
        </Text>
        <Text style={styles.subtitle}>1트랙은 반드시 주전공에서 선택해야 합니다</Text>

        <Text style={styles.inputLabel}>1트랙 (주전공 필수)</Text>
        <TextInput
          style={styles.input}
          placeholder="예: 웹공학트랙"
          placeholderTextColor={colors.textHint}
          value={track1}
          onChangeText={setTrack1}
          returnKeyType="next"
        />
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>▲ 1트랙은 주전공 소속 트랙만 가능</Text>
        </View>

        <View style={styles.spacer} />

        <Text style={styles.inputLabel}>2트랙 (자유 선택)</Text>
        <TextInput
          style={styles.input}
          placeholder="EX) 웹공학트랙"
          placeholderTextColor={colors.textHint}
          value={track2}
          onChangeText={setTrack2}
          returnKeyType="done"
        />
      </View>

      <View style={styles.bottomArea}>
        <Button
          title="다음 단계로"
          variant={canProceed ? 'primary' : 'disabled'}
          onPress={handleNext}
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
    marginBottom: 8,
  },
  titleHighlight: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 28,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textPrimary,
  },
  warningBox: {
    marginTop: 8,
    backgroundColor: '#FFF8E7',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  warningText: {
    fontSize: 12,
    color: '#B45309',
  },
  spacer: {
    height: 24,
  },
  bottomArea: {
    paddingTop: 12,
  },
});
