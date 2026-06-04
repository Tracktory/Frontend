import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

interface MyProfileHeroCardProps {
  deptLine: string;
  displayName: string;
  metaLine: string;
  completedCount: number;
  miniStatCompetencyValue: string;
}

function MiniStat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <View style={styles.miniStat}>
      <Text style={styles.miniStatLabel}>{label}</Text>
      <View style={styles.miniStatValueRow}>
        <Text style={styles.miniStatValue}>{value}</Text>
        {unit ? <Text style={styles.miniStatUnit}>{unit}</Text> : null}
      </View>
    </View>
  );
}

export function MyProfileHeroCard({
  deptLine,
  displayName,
  metaLine,
  completedCount,
  miniStatCompetencyValue,
}: MyProfileHeroCardProps) {
  const competencyUnit = miniStatCompetencyValue === '-' ? '' : '%';

  return (
    <View style={styles.wrap}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <LinearGradient id="profileHeroGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#14B8A6" />
            <Stop offset="1" stopColor="#0D9488" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" rx={24} fill="url(#profileHeroGrad)" />
      </Svg>

      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color="#FFFFFF" />
        </View>
        <View style={styles.textCol}>
          <Text style={styles.dept}>{deptLine}</Text>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.meta}>{metaLine}</Text>
        </View>
      </View>

      <View style={styles.statsDivider} />
      <View style={styles.statsRow}>
        <MiniStat label="이수 과목" value={`${completedCount}`} unit="개" />
        <MiniStat
          label="역량 커버리지"
          value={miniStatCompetencyValue}
          unit={competencyUnit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    minHeight: 160,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 4,
  },
  dept: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  meta: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  statsDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    marginTop: 16,
    paddingTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  miniStat: {
    flex: 1,
    gap: 4,
  },
  miniStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  miniStatValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  miniStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  miniStatUnit: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
});
