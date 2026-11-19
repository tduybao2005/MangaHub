import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MangaProvider } from '../context/MangaContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { ReadingProvider } from '../context/ReadingContext';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import COLORS from '../constants/colors';

// Stack gốc: (tabs) -> detail -> reader (nền theo giao diện sáng / tối)
function ThemedStack() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: '#fff',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="detail" options={{ title: 'Chi tiết truyện' }} />
      <Stack.Screen name="reader" options={{ title: 'Đọc truyện' }} />
      <Stack.Screen name="login" options={{ title: 'Đăng nhập' }} />
      <Stack.Screen name="register" options={{ title: 'Đăng ký' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <MangaProvider>
        <FavoritesProvider>
          <ReadingProvider>
            <AuthProvider>
              <StatusBar style="light" />
              <ThemedStack />
            </AuthProvider>
          </ReadingProvider>
        </FavoritesProvider>
      </MangaProvider>
    </ThemeProvider>
  );
}
