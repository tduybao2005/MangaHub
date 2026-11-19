import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const OPTIONS = [
  { key: 'light', label: 'Sáng', icon: 'sunny' },
  { key: 'dark', label: 'Tối', icon: 'moon' },
  { key: 'system', label: 'Hệ thống', icon: 'phone-portrait' },
];

// Chọn giao diện: Sáng / Tối / Theo hệ thống (lựa chọn được lưu vào máy)
export default function ThemeSwitcher() {
  const { colors: COLORS, mode, setMode } = useTheme();
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Giao diện</Text>
      <View style={styles.row}>
        {OPTIONS.map((o) => {
          const active = mode === o.key;
          return (
            <TouchableOpacity
              key={o.key}
              style={[styles.option, active && styles.optionActive]}
              onPress={() => setMode(o.key)}
            >
              <Ionicons name={o.icon} size={18} color={active ? '#fff' : COLORS.muted} />
              <Text style={[styles.label, active && styles.labelActive]}>{o.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const makeStyles = (COLORS) => StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 320,
    marginTop: 28,
  },
  title: {
    color: COLORS.muted,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: COLORS.border,
    borderRadius: 8,
    padding: 3,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 6,
  },
  optionActive: {
    backgroundColor: COLORS.primary,
  },
  label: {
    color: COLORS.muted,
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 13,
  },
  labelActive: {
    color: '#fff',
  },
});
