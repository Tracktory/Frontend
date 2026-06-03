import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';

import Logo from '../../assets/images/Logo.svg';
import { Button } from '../../components/Button';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = StackScreenProps<AuthStackParamList, 'Welcome'>;

const WELCOME_BG = '#F0FDFA';

export function WelcomePage({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.screen}>
        <View style={styles.hero}>
          <Logo width={130} height={114} />
          <Text style={styles.title}>Tracktory</Text>
          <Text style={styles.subtitlePrimary}>AI 기반 맞춤 학습경로 추천</Text>
          <Text style={styles.subtitleSecondary}>
            한성대학교 IT융합공학부 자율전공생을 위한{'\n'}나만의 커리어 로드맵을 만들어보세요
          </Text>
        </View>

        <View style={styles.bottomArea}>
          <Button title="로그인" variant="primary" onPress={() => navigation.navigate('Login')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WELCOME_BG,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    gap: 12,
  },
  title: {
    marginTop: 8,
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  subtitlePrimary: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  subtitleSecondary: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 22,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  bottomArea: {
    paddingTop: 16,
  },
});
