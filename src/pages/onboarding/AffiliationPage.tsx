import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { AffiliationCard } from './components/AffiliationCard';

type Props = StackScreenProps<OnboardingStackParamList, 'Affiliation'>;

export function AffiliationPage({ navigation }: Props) {
  const admissionYear = useOnboardingStore((state) => state.admissionYear);
  const grade = useOnboardingStore((state) => state.grade);
  const affiliation = useOnboardingStore((state) => state.affiliation);
  const setAffiliation = useOnboardingStore((state) => state.setAffiliation);

  useEffect(() => {
    console.log('[Render] AffiliationPage mounted', {
      admissionYear,
      grade,
      affiliation,
    });
  }, [admissionYear, grade, affiliation]);

  const subtitle = admissionYear && grade
    ? `${admissionYear}년 입학 → ${grade}학년 (자동 산출)`
    : '입학년도 선택값이 없습니다';

  const handleSelectAffiliation = (type: '1학년' | '2학년이상') => {
    setAffiliation(type);
    console.log(`[Onboarding] 소속 선택 완료: ${type}`);
    console.log('[Onboarding] 다음 화면은 아직 미구현입니다.');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </Pressable>
      </View>

      <Text style={styles.screenId}>ON-SCR-02 | ON-003, ON-004</Text>
      <ProgressBar progress={0.28} />

      <Text style={styles.title}>소속을 선택해주세요</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <AffiliationCard
        title="1학년 (신입생)"
        description="단과대 소속, 트랙 미선택 상태"
        linkText="→ 단과대 선택으로 이동"
        selected={affiliation === '1학년'}
        onPress={() => handleSelectAffiliation('1학년')}
      />
      <AffiliationCard
        title="2학년 이상"
        description="트랙 선택 완료 (1트랙 + 2트랙)"
        linkText="→ 트랙 입력으로 이동"
        selected={affiliation === '2학년이상'}
        onPress={() => handleSelectAffiliation('2학년이상')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  headerRow: {
    minHeight: 44,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    marginBottom: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingRight: 12,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
  },
  screenId: {
    fontSize: 12,
    color: '#A3A3A3',
    marginBottom: 8,
    fontWeight: '500',
  },
  title: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 22,
    lineHeight: 30,
    color: '#737373',
    marginBottom: 24,
  },
});
