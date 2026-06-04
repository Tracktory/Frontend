import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../../../styles/colors';

interface TrackTextInputFormProps {
  track1Input: string;
  track2Input: string;
  onTrack1Change: (value: string) => void;
  onTrack2Change: (value: string) => void;
  track1Error?: string | null;
  track2Error?: string | null;
}

export function TrackTextInputForm({
  track1Input,
  track2Input,
  onTrack1Change,
  onTrack2Change,
  track1Error,
  track2Error,
}: TrackTextInputFormProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.hint}>1트랙은 주전공 트랙만 가능해요</Text>

      <Text style={styles.label}>1트랙 (필수)</Text>
      <TextInput
        style={[styles.input, track1Error ? styles.inputError : null]}
        placeholder="예: 빅데이터트랙, 웹공학"
        placeholderTextColor={colors.textHint}
        value={track1Input}
        onChangeText={onTrack1Change}
        autoCorrect={false}
      />
      {track1Error ? <Text style={styles.errorText}>{track1Error}</Text> : null}

      <Text style={[styles.label, styles.labelGap]}>2트랙 (선택)</Text>
      <TextInput
        style={[styles.input, track2Error ? styles.inputError : null]}
        placeholder="예: 모바일소프트웨어트랙 (없으면 비워두세요)"
        placeholderTextColor={colors.textHint}
        value={track2Input}
        onChangeText={onTrack2Change}
        autoCorrect={false}
      />
      {track2Error ? <Text style={styles.errorText}>{track2Error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  hint: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textStrong,
  },
  labelGap: {
    marginTop: 12,
  },
  input: {
    height: 52,
    backgroundColor: colors.inputSurface,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.stageCap,
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    fontSize: 12,
    color: colors.stageCap,
    fontWeight: '500',
    marginTop: 2,
  },
});
