import React, { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../styles/colors';
import { useRecommendResultViewModel } from '../../hooks/useRecommendResultViewModel';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useProfileStore } from '../../stores/profileStore';
import { useAuthStore } from '../../stores/authStore';
import type { MainStackParamList } from '../../navigation/MainStackNavigator';
import { JourneyHeader } from './components/JourneyHeader';
import { JourneyMountainBackground } from './components/JourneyMountainBackground';
import { JourneyPathNodes } from './components/JourneyPathNodes';
import { JourneyStatusCard } from './components/JourneyStatusCard';
import { JourneyBottomSheet } from './components/JourneyBottomSheet';
import { JourneyCompetencySheet } from './components/sheets/JourneyCompetencySheet';
import { JourneyJobMatchingSheet } from './components/sheets/JourneyJobMatchingSheet';
import { JourneyCurrentStatusSheet } from './components/sheets/JourneyCurrentStatusSheet';
import { JourneyRoadmapSheet } from './components/sheets/JourneyRoadmapSheet';
import { JourneyTrackSynergySheet } from './components/sheets/JourneyTrackSynergySheet';
import { ChatFab } from '../../components/ChatFab';
import { ChatOverlayModal } from '../../components/chat/ChatOverlayModal';

const TAB_BAR_CLEARANCE = 100;

export function RecommendResultPage() {
  const vm = useRecommendResultViewModel();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const completedCourses = useOnboardingStore((s) => s.completedCourses);
  const grade = useOnboardingStore((s) => s.grade);
  const track1 = useOnboardingStore((s) => s.track1);
  const track2 = useOnboardingStore((s) => s.track2);
  const profile = useProfileStore((s) => s.profile);
  const userName = useAuthStore((s) => s.userName);

  const profileCurrentYear = profile?.profile.currentYear;
  const displayName = profile?.profile.name ?? userName ?? '';
  const profileInitial = displayName ? displayName.charAt(0) : '?';

  const [mapSize, setMapSize] = useState({ width: 0, height: 320 });
  const [chatVisible, setChatVisible] = useState(false);

  const onMapLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setMapSize({ width, height });
    }
  };

  const renderSheetContent = () => {
    switch (vm.activeSheet) {
      case 'competency':
        return (
          <JourneyCompetencySheet
            roadmap={vm.roadmap}
            completedCourses={completedCourses}
          />
        );
      case 'job':
        return (
          <JourneyJobMatchingSheet
            jobs={vm.jobs}
            hasJobData={vm.hasJobData}
            navigation={navigation}
            onSelectJob={vm.handleSelectJob}
          />
        );
      case 'current':
        return (
          <JourneyCurrentStatusSheet
            roadmap={vm.roadmap}
            completedCourses={completedCourses}
            grade={grade}
            profileCurrentYear={profileCurrentYear}
            track1={track1}
            track2={track2}
          />
        );
      case 'roadmap':
        return (
          <JourneyRoadmapSheet
            roadmap={vm.roadmap}
            isError={vm.isError}
            onRetry={vm.refresh}
          />
        );
      case 'trackSynergy':
        return (
          <JourneyTrackSynergySheet data={vm.trackRecommend} />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        <JourneyHeader
          displayName={displayName}
          profileInitial={profileInitial}
          onBriefingPress={vm.refresh}
        />

        {vm.isError ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={colors.textHint} />
            <Text style={styles.errorText}>추천 결과를 불러오지 못했습니다</Text>
            <Pressable style={styles.retryButton} onPress={vm.refresh}>
              <Text style={styles.retryButtonText}>재시도</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.mapArea} onLayout={onMapLayout}>
              {mapSize.width > 0 ? (
                <JourneyMountainBackground width={mapSize.width} height={mapSize.height} />
              ) : null}
              <JourneyPathNodes
                mapHeight={mapSize.height}
                onOpenSheet={vm.openSheet}
              />
            </View>

            <JourneyStatusCard
              roadmap={vm.roadmap}
              completedCourses={completedCourses}
              onPress={() => vm.openSheet('current')}
            />
          </>
        )}

        <JourneyBottomSheet
          visible={vm.activeSheet != null}
          sheetKey={vm.activeSheet}
          onClose={vm.closeSheet}
        >
          {renderSheetContent()}
        </JourneyBottomSheet>

        <ChatFab onPress={() => setChatVisible(true)} />
        <ChatOverlayModal visible={chatVisible} onClose={() => setChatVisible(false)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0FDFA',
  },
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: TAB_BAR_CLEARANCE,
  },
  mapArea: {
    flex: 1,
    minHeight: 280,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  retryButton: {
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 28,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});
