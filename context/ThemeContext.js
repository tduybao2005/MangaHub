import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { LIGHT, DARK } from '../constants/colors';
import { loadJSON, saveJSON } from '../utils/storage';

// mode: 'light' | 'dark' | 'system' (theo cài đặt của điện thoại)
const MODES = ['light', 'dark', 'system'];

// B1 — Tạo kênh phát giao diện (màu sắc)
const ThemeContext = createContext();

// B2 — Phát sóng giá trị từ gốc ứng dụng
export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setMode] = useState('system');
  const [loaded, setLoaded] = useState(false);

  // Mở app: đọc lựa chọn đã lưu
  useEffect(() => {
    loadJSON('theme', 'system').then((saved) => {
      setMode(MODES.includes(saved) ? saved : 'system');
      setLoaded(true);
    });
  }, []);

  // Đổi lựa chọn (và đã đọc xong) -> ghi lại vào máy
  useEffect(() => {
    if (loaded) saveJSON('theme', mode);
  }, [mode, loaded]);

  const isDark = mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
  const colors = isDark ? DARK : LIGHT;

  const value = useMemo(() => ({ mode, setMode, isDark, colors }), [mode, isDark, colors]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// B3 — Màn hình nào cần thì "nghe": { colors, isDark, mode, setMode }
export const useTheme = () => useContext(ThemeContext);
