import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { LoadingDots } from '../../components/LoadingDots';
import { useRecommendLoadingViewModel } from '../../hooks/useRecommendLoadingViewModel';
import type { MainStackParamList } from '../../navigation/MainStackNavigator';
import { colors } from '../../styles/colors';
import { RECOMMEND_LOADING_MESSAGES } from '../onboarding/data/onboardingCopy';

type Props = StackScreenProps<MainStackParamList, 'RecommendLoading'>;

const STAGE_LABELS = [
  '프로필 분석',
  '트랙 조합 탐색',
  '교과 로드맵 생성',
] as const;

export function RecommendLoadingPage(_props: Props) {
  const vm = useRecommendLoadingViewModel();
  const [messageIndex, setMessageIndex] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (vm.isError) return;

    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % RECOMMEND_LOADING_MESSAGES.length);
    }, 2800);

    const stageTimer = setInterval(() => {
      setStageIndex((prev) => Math.min(prev + 1, STAGE_LABELS.length - 1));
    }, 3200);

    return () => {
      clearInterval(messageTimer);
      clearInterval(stageTimer);
    };
  }, [vm.isError]);

  return (
    <View style={styles.screen}>
      <View style={styles.center}>
        <LoadingDots />
        <Text style={styles.title}>{RECOMMEND_LOADING_MESSAGES[messageIndex]}</Text>
        {!vm.isError ? (
          <View style={styles.stages}>
            {STAGE_LABELS.map((label, index) => (
              <Text
                key={label}
                style={[
                  styles.stageText,
                  index <= stageIndex && styles.stageTextActive,
                ]}
              >
                {index <= stageIndex ? '✓ ' : '· '}
                {label}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.subLine}>잠시 후 다시 시도해 주세요</Text>
        )}
      </View>

      {vm.isError && (
        <View style={styles.bottom}>
          {vm.errorMessage ? (
            <Text style={styles.errorText}>{vm.errorMessage}</Text>
          ) : null}
          <Button title="다시 해볼게요" variant="primary" onPress={vm.handleRetry} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 28,
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 8,
  },
  subLine: {
    marginTop: 16,
    fontSize: 14,
    color: colors.textHint,
    textAlign: 'center',
  },
  stages: {
    marginTop: 24,
    gap: 8,
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: 280,
  },
  stageText: {
    fontSize: 14,
    color: colors.textHint,
    lineHeight: 22,
  },
  stageTextActive: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  bottom: {
    paddingBottom: 32,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
