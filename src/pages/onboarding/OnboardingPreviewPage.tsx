import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { ONBOARDING_COPY } from './data/onboardingCopy';
import { getOnboardingProgress } from './data/onboardingProgress';
import { OnboardingStepLayout } from './components/OnboardingStepLayout';

type Props = StackScreenProps<OnboardingStackParamList, 'OnboardingPreview'>;

export function OnboardingPreviewPage({ navigation }: Props) {
  const affiliation = useOnboardingStore((s) => s.affiliation);
  const copy = ONBOARDING_COPY.preview;
  const isFirstYear = affiliation !== '2학년이상';
  const blurTitle = isFirstYear ? '추천 트랙' : '추천 직무';

  return (
    <OnboardingStepLayout
      progress={getOnboardingProgress('OnboardingPreview', affiliation)}
      title={copy.title}
      subtitle={copy.subtitle}
      showBack
      onBack={() => navigation.goBack()}
      primaryTitle={copy.ctaPrimary}
      onPrimaryPress={() => navigation.navigate('OnboardingConfirm')}
      scrollable
    >
      <View style={styles.cardWrap}>
        <View style={styles.blurCard}>
          <Text style={styles.blurLabel}>{blurTitle}</Text>
          <Text style={styles.blurHint}>AI가 맞춤 결과를 준비했어요</Text>
          <View style={styles.blurOverlay} pointerEvents="none">
            <View style={styles.blurPlaceholder} />
          </View>
        </View>
        <Pressable
          style={styles.pill}
          onPress={() => navigation.navigate('OnboardingConfirm')}
        >
          <Text style={styles.pillText}>전체 결과 보러 가기 👇</Text>
        </Pressable>
      </View>
    </OnboardingStepLayout>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    alignItems: 'center',
    gap: 20,
    paddingTop: 8,
  },
  blurCard: {
    width: '100%',
    minHeight: 200,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    backgroundColor: '#FFFFFF',
    padding: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  blurHint: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  blurPlaceholder: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#F0FDFA',
    opacity: 0.9,
  },
  pill: {
    backgroundColor: '#14B8A6',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
