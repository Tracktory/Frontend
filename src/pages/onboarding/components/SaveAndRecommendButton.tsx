import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { Button } from '../../../components/Button';
import { colors } from '../../../styles/colors';

interface SaveAndRecommendButtonProps {
  onPress: () => void;
  isLoading?: boolean;
}

export function SaveAndRecommendButton({ onPress, isLoading }: SaveAndRecommendButtonProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingBtn}>
        <ActivityIndicator color={colors.white} />
      </View>
    );
  }
  return <Button title="AI에게 맡기기" variant="primary" onPress={onPress} />;
}

const styles = StyleSheet.create({
  loadingBtn: {
    width: '100%',
    minHeight: 58,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
