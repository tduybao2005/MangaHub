import React from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useManga } from '../../context/MangaContext';
import { useFavorites } from '../../context/FavoritesContext';
import SeriesItem from '../../components/SeriesItem';
import { LoadingView, ErrorView } from '../../components/StatusView';
import COLORS from '../../constants/colors';

export default function HomeScreen() {
  const router = useRouter();
  const { seriesList, loading, error, reload } = useManga();
  const { isFavorite } = useFavorites();

  if (loading && seriesList.length === 0) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={reload} />;

  return (
    <FlatList
      style={styles.list}
      data={seriesList}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<Text style={styles.header}>Tất cả truyện ({seriesList.length})</Text>}
      renderItem={({ item }) => (
        <SeriesItem
          series={item}
          isFavorite={isFavorite(item.id)}
          onPress={() => router.push({ pathname: '/detail', params: { id: item.id } })}
        />
      )}
      // Kéo xuống để tải lại
      refreshing={loading}
      onRefresh={reload}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 6,
  },
});
