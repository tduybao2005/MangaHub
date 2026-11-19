import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// 1 ô nhập có nhãn + dòng báo lỗi bên dưới. secureTextEntry: ô mật khẩu có nút hiện/ẩn
export default function FormField({ label, error, secureTextEntry, ...inputProps }) {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.muted}
          secureTextEntry={secureTextEntry && hidden}
          autoCapitalize="none"
          {...inputProps}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setHidden((h) => !h)} hitSlop={8}>
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.muted} />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const makeStyles = (COLORS) => StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  label: {
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  error: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
  },
});
