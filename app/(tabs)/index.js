import React from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useManga } from '../../context/MangaContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useReading } from '../../context/ReadingContext';
import SeriesItem from '../../components/SeriesItem';
import ContinueReading from '../../components/ContinueReading';
import { LoadingView, ErrorView } from '../../components/StatusView';
import COLORS from '../../constants/colors';

export default function HomeScreen() {
  const router = useRouter();
  const { seriesList, loading, error, reload } = useManga();
  const { isFavorite } = useFavorites();
  const { progress } = useReading();

  if (loading && seriesList.length === 0) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={reload} />;

  // Các truyện đang đọc dở, mới đọc nhất lên đầu (bỏ qua truyện/chương không còn trong dữ liệu)
  const continueItems = Object.entries(progress)
    .map(([seriesId, p]) => {
      const series = seriesList.find((s) => s.id === seriesId);
      const chapter = series && series.chapters.find((c) => c.id === p.chapterId);
      return series && chapter ? { series, chapter, page: p.page, updatedAt: p.updatedAt } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const openReader = ({ series, chapter, page }) =>
    router.push({ pathname: '/reader', params: { seriesId: series.id, chapterId: chapter.id, page } });

  return (
    <FlatList
      style={styles.list}
      data={seriesList}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          <ContinueReading items={continueItems} onPress={openReader} />
          <Text style={styles.header}>Tất cả truyện ({seriesList.length})</Text>
        </>
      }
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
