import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
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
    console.log('[Onboarding] 2학년+ 트랙 입력:', { track1, track2 });
    navigation.navigate('InterestSelectSophomore');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </Pressable>
        <Text style={styles.headerTitle}>2학년+ 흐름</Text>
      </View>

      <Text style={styles.screenId}>ON-SCR-03b | ON-004, ON-006</Text>
      <ProgressBar progress={0.28} />

      <Text style={styles.title}>트랙 정보를 입력해주세요</Text>
      <Text style={styles.subtitle}>1트랙은 반드시 주전공에서 선택해야 합니다</Text>

      <Text style={styles.inputLabel}>1트랙 (주전공 필수)</Text>
      <TextInput
        style={styles.input}
        placeholder="예: 웹공학트랙"
        placeholderTextColor="#A3A3A3"
        value={track1}
        onChangeText={setTrack1}
      />
      <Text style={styles.warning}>⚠ 1트랙은 주전공 소속 트랙만 선택 가능합니다</Text>

      <View style={styles.spacer} />

      <Text style={styles.inputLabel}>2트랙 (자유 선택)</Text>
      <TextInput
        style={styles.input}
        placeholder="예: AI트랙"
        placeholderTextColor="#A3A3A3"
        value={track2}
        onChangeText={setTrack2}
      />
      <Text style={styles.helper}>2트랙은 모든 트랙에서 자유롭게 선택 가능합니다</Text>

      <View style={styles.bottomArea}>
        <Button
          title={canProceed ? '다음' : '다음 (1트랙을 입력해주세요)'}
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
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 28,
  },
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
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#333333', marginLeft: 8 },
  screenId: { fontSize: 12, color: '#A3A3A3', marginBottom: 8, fontWeight: '500' },
  title: { fontSize: 36, lineHeight: 44, fontWeight: '700', color: '#171717', marginBottom: 8 },
  subtitle: { fontSize: 18, lineHeight: 26, color: '#737373', marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#404040', marginBottom: 8 },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#171717',
  },
  warning: { marginTop: 8, fontSize: 12, color: '#E11D48' },
  helper: { marginTop: 8, fontSize: 12, color: '#888888' },
  spacer: { height: 20 },
  bottomArea: { marginTop: 'auto', paddingTop: 12 },
});
