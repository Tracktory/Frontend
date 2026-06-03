import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { AIActionItem } from '../../../data/analysisReportStaticMock';
import { AnalysisReportSection } from '../AnalysisReportSection';

interface AIActionsSectionProps {
  actions: AIActionItem[];
}

export function AIActionsSection({ actions }: AIActionsSectionProps) {
  return (
    <AnalysisReportSection title="AI 추천 다음 액션" iconName="flash">
      {actions.map((action, i) => (
        <Animated.View
          key={action.text}
          entering={FadeInDown.delay(i * 80).duration(300)}
          style={styles.card}
        >
          <Text style={styles.icon}>{action.icon}</Text>
          <Text style={styles.text}>{action.text}</Text>
        </Animated.View>
      ))}
    </AnalysisReportSection>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  icon: {
    fontSize: 20,
  },
  text: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
  },
});
