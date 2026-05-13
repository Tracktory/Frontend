import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

interface Props {
  title: string;
  skills: string[];
  variant?: 'core' | 'advanced';
}

export function JobDetailSkillSection({ title, skills, variant = 'core' }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.chipRow}>
        {skills.map((skill) => (
          <View
            key={skill}
            style={[styles.chip, variant === 'advanced' ? styles.chipAdvanced : styles.chipCore]}
          >
            <Text
              style={[
                styles.chipText,
                variant === 'advanced' ? styles.chipTextAdvanced : styles.chipTextCore,
              ]}
            >
              {skill}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textStrong,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipCore: {
    backgroundColor: colors.primaryLight,
  },
  chipAdvanced: {
    backgroundColor: colors.primaryLight,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextCore: {
    color: colors.primary,
  },
  chipTextAdvanced: {
    color: colors.primary,
  },
});
