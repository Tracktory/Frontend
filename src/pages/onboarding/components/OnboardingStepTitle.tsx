import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { colors } from '../../../styles/colors';

interface OnboardingStepTitleProps {
  children: React.ReactNode;
}

export function OnboardingStepTitle({ children }: OnboardingStepTitleProps) {
  return <Text style={styles.title}>{children}</Text>;
}

interface OnboardingTitleHighlightProps {
  children: string;
}

export function OnboardingTitleHighlight({ children }: OnboardingTitleHighlightProps) {
  return <Text style={styles.highlight}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  highlight: {
    color: colors.primary,
  },
});
