import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MangaProvider } from '../context/MangaContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import COLORS from '../constants/colors';

// Stack gốc: (tabs) -> detail -> reader
export default function RootLayout() {
  return (
    <MangaProvider>
      <FavoritesProvider>
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
        </Stack>
      </FavoritesProvider>
    </MangaProvider>
  );
}
