import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { colors } from '../../styles/colors';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { AffiliationCard } from './components/AffiliationCard';

type Props = StackScreenProps<OnboardingStackParamList, 'Affiliation'>;

export function AffiliationPage({ navigation }: Props) {
  const admissionYear = useOnboardingStore((state) => state.admissionYear);
  const affiliation = useOnboardingStore((state) => state.affiliation);
  const setAffiliation = useOnboardingStore((state) => state.setAffiliation);

  const subtitle = admissionYear ? `${admissionYear}년 입학생 기준` : '';

  const handleNext = () => {
    if (!affiliation) return;
    if (affiliation === '1학년') {
      navigation.navigate('CollegeSelect');
    } else {
      navigation.navigate('TrackInput');
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.screenLabel}>온보딩</Text>
        <ProgressBar progress={0.28} />

        <Text style={styles.title}>소속을 선택해주세요</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <AffiliationCard
          title="1학년 신입생"
          selected={affiliation === '1학년'}
          onPress={() => setAffiliation('1학년')}
        />
        <AffiliationCard
          title="2학년 이상 재학생"
          selected={affiliation === '2학년이상'}
          onPress={() => setAffiliation('2학년이상')}
        />
      </View>

      <View style={styles.bottomArea}>
        <Button
          title="다음 단계로"
          variant={affiliation ? 'primary' : 'disabled'}
          onPress={handleNext}
          subtitle={affiliation ? undefined : '소속을 선택해주세요'}
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
  screenLabel: {
    fontSize: 12,
    color: colors.textHint,
    marginBottom: 8,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  bottomArea: {
    paddingTop: 12,
  },
});
