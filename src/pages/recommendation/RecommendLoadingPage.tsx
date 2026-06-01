import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { LoadingDots } from '../../components/LoadingDots';
import { useRecommendLoadingViewModel } from '../../hooks/useRecommendLoadingViewModel';
import type { MainStackParamList } from '../../navigation/MainStackNavigator';
import { colors } from '../../styles/colors';

type Props = StackScreenProps<MainStackParamList, 'RecommendLoading'>;

export function RecommendLoadingPage(_props: Props) {
  const vm = useRecommendLoadingViewModel();

  return (
    <View style={styles.screen}>
      <View style={styles.center}>
        <LoadingDots />
        <Text style={styles.title}>로딩 중...</Text>
        <Text style={styles.subLine}>잠시만 기다려주세요</Text>
      </View>

      {vm.isError && (
        <View style={styles.bottom}>
          {vm.errorMessage ? (
            <Text style={styles.errorText}>{vm.errorMessage}</Text>
          ) : null}
          <Button title="재시도" variant="primary" onPress={vm.handleRetry} />
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subLine: {
    marginTop: 10,
    fontSize: 14,
    color: colors.textHint,
    textAlign: 'center',
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
