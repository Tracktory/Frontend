import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { ProgressBar } from '../../components/ProgressBar';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';

type Props = StackScreenProps<OnboardingStackParamList, 'CollegeSelect'>;

const colleges = [
  '크리에이티브인문예술대학',
  '미래융합대학',
  '상상력인재학부',
];

const tracks = ['웹공학트랙', '모바일소프트웨어트랙', 'AI트랙'];

export function CollegeSelectPage({ navigation }: Props) {
  const college = useOnboardingStore((state) => state.college);
  const setCollege = useOnboardingStore((state) => state.setCollege);

  const handleSelectCollege = (selectedCollege: string) => {
    setCollege(selectedCollege);
    console.log(`[Onboarding] 단과대 선택 완료: ${selectedCollege}`);
    navigation.navigate('InterestSelect');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </Pressable>
        <Text style={styles.headerTitle}>1학년 흐름</Text>
      </View>

      <Text style={styles.screenId}>ON-SCR-03a | ON-003, ON-005</Text>
      <ProgressBar progress={0.28} />

      <Text style={styles.title}>단과대를 선택해주세요</Text>
      <Text style={styles.subtitle}>소속 단과대의 트랙 목록을 참고용으로 표시합니다</Text>

      {colleges.map((item) => (
        <Pressable
          key={item}
          style={({ pressed }) => [
            styles.collegeButton,
            college === item && styles.selectedButton,
            pressed && styles.pressed,
          ]}
          onPress={() => handleSelectCollege(item)}
        >
          <Text style={[styles.collegeLabel, college === item && styles.selectedLabel]}>{item}</Text>
        </Pressable>
      ))}

      <View style={styles.trackContainer}>
        <Text style={styles.trackHeader}>참고: 해당 단과대 트랙 목록</Text>
        <View style={styles.tagsWrapper}>
          {tracks.map((track) => (
            <View key={track} style={styles.tag}>
              <Text style={styles.tagLabel}>{track}</Text>
            </View>
          ))}
        </View>
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
  },
  headerRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    marginBottom: 10,
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 12,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
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
  collegeButton: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F8F8F8',
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedButton: {
    borderColor: '#2563EB',
    backgroundColor: '#EEF4FF',
  },
  pressed: {
    opacity: 0.92,
  },
  collegeLabel: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '500',
  },
  selectedLabel: {
    color: '#1E40AF',
  },
  trackContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#EEF4FF',
  },
  trackHeader: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderRadius: 8,
    backgroundColor: '#E8F0FE',
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  tagLabel: {
    fontSize: 12,
    color: '#2563EB',
  },
});
