import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function MyPageHeader() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>마이페이지</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
});
