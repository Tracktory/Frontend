import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ALL_TRACK_OPTIONS } from '../data/onboardingOptions';
import { colors } from '../../../styles/colors';
import { InterestChip } from './InterestChip';

interface TrackSelectListProps {
  value: string;
  onSelect: (track: string) => void;
  hint?: string;
}

export function TrackSelectList({ value, onSelect, hint }: TrackSelectListProps) {
  const [query, setQuery] = useState('');

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_TRACK_OPTIONS;
    return ALL_TRACK_OPTIONS.filter((track) => track.toLowerCase().includes(q));
  }, [query]);

  return (
    <View style={styles.wrap}>
      <TextInput
        style={styles.searchInput}
        placeholder="트랙 이름 검색"
        placeholderTextColor={colors.textHint}
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.chipGroup}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filteredOptions.map((track) => (
          <InterestChip
            key={track}
            label={track}
            selected={value === track}
            onPress={() => onSelect(track)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  searchInput: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
    paddingHorizontal: 0,
  },
  hint: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  list: {
    flex: 1,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingBottom: 16,
  },
});
