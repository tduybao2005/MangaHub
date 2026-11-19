import React, { useMemo } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// Hiển thị khi đang tải
export function LoadingView() {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.text}>Đang tải...</Text>
    </View>
  );
}

// Hiển thị khi lỗi, có nút thử lại
export function ErrorView({ message, onRetry, buttonTitle = 'Thử lại' }) {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);
  return (
    <View style={styles.center}>
      <Text style={styles.error}>Lỗi: {message}</Text>
      <Button title={buttonTitle} color={COLORS.primary} onPress={onRetry} />
    </View>
  );
}

const makeStyles = (COLORS) => StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  text: {
    marginTop: 8,
    color: COLORS.muted,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});
