import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';

type Props = StackScreenProps<OnboardingStackParamList, 'RecommendLoading'>;

function LoadingDots() {
  const a1 = useRef(new Animated.Value(0.3)).current;
  const a2 = useRef(new Animated.Value(0.3)).current;
  const a3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const makeLoop = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    const l1 = makeLoop(a1, 0);
    const l2 = makeLoop(a2, 150);
    const l3 = makeLoop(a3, 300);
    l1.start();
    l2.start();
    l3.start();
    return () => {
      l1.stop();
      l2.stop();
      l3.stop();
    };
  }, [a1, a2, a3]);

  return (
    <View style={dotStyles.row}>
      <Animated.View style={[dotStyles.dot, { opacity: a1 }]} />
      <Animated.View style={[dotStyles.dot, dotStyles.dotSpacing, { opacity: a2 }]} />
      <Animated.View style={[dotStyles.dot, dotStyles.dotSpacing, { opacity: a3 }]} />
    </View>
  );
}

const dotStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
  },
  dotSpacing: { marginLeft: 10 },
});

export function RecommendLoadingPage(_props: Props) {
  const handleDemoResult = () => {
    console.log('[HM] 결과 보기 데모 (HM-SCR-02 미구현)');
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.screenId}>HM-SCR-01 | HM-019</Text>

      <View style={styles.center}>
        <LoadingDots />
        <Text style={styles.title}>AI가 분석 중입니다</Text>
        <Text style={styles.subLine}>
          관심사와 흥미를 바탕으로{'\n'}맞춤 추천을 생성하고 있어요
        </Text>
        <Text style={styles.hint}>약 10~15초 소요</Text>
      </View>

      <View style={styles.bottom}>
        <Button title="결과 보기 (데모)" variant="primary" onPress={handleDemoResult} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 32,
  },
  screenId: {
    fontSize: 12,
    color: '#A3A3A3',
    fontWeight: '500',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    marginTop: 28,
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  subLine: {
    marginTop: 10,
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 22,
  },
  hint: {
    marginTop: 36,
    fontSize: 12,
    color: '#AAAAAA',
  },
  bottom: {
    marginTop: 'auto',
    paddingTop: 16,
  },
});
