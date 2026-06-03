import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AnalysisReportFooterProps {
  onOpenChat: () => void;
}

export function AnalysisReportFooter({ onOpenChat }: AnalysisReportFooterProps) {
  return (
    <View style={styles.wrap}>
      <Pressable
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        onPress={onOpenChat}
      >
        <Text style={styles.ctaText}>AI 챗봇으로 상세 상담받기</Text>
        <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
      </Pressable>
      <Text style={styles.footer}>
        Tracktory AI · 한성대학교 IT융합공학부
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#14B8A6',
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  ctaPressed: {
    opacity: 0.92,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footer: {
    fontSize: 11,
    color: '#D1D5DB',
    textAlign: 'center',
  },
});
