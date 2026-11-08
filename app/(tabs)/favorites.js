import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useManga } from '../../context/MangaContext';
import { useFavorites } from '../../context/FavoritesContext';
import SeriesItem from '../../components/SeriesItem';
import COLORS from '../../constants/colors';

export default function FavoritesScreen() {
  const router = useRouter();
  const { getSeries } = useManga();
  const { favoriteIds } = useFavorites();

  // Đổi danh sách id đã thích thành danh sách bộ truyện
  const favorites = favoriteIds.map(getSeries).filter(Boolean);

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SeriesItem
            series={item}
            isFavorite
            onPress={() => router.push({ pathname: '/detail', params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Chưa có truyện nào. Bấm "Yêu thích" ở màn hình chi tiết để thêm vào đây.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 6,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.muted,
    marginTop: 24,
    marginHorizontal: 24,
    lineHeight: 20,
  },
});
