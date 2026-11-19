import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MangaProvider } from '../context/MangaContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { ReadingProvider } from '../context/ReadingContext';
import { AuthProvider } from '../context/AuthContext';
import COLORS from '../constants/colors';

// Stack gốc: (tabs) -> detail -> reader
export default function RootLayout() {
  return (
    <MangaProvider>
      <FavoritesProvider>
        <ReadingProvider>
          <AuthProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: COLORS.primary },
                headerTintColor: '#fff',
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="detail" options={{ title: 'Chi tiết truyện' }} />
              <Stack.Screen name="reader" options={{ title: 'Đọc truyện' }} />
              <Stack.Screen name="login" options={{ title: 'Đăng nhập' }} />
              <Stack.Screen name="register" options={{ title: 'Đăng ký' }} />
            </Stack>
          </AuthProvider>
        </ReadingProvider>
      </FavoritesProvider>
    </MangaProvider>
  );
}
