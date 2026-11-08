import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useManga } from '../../context/MangaContext';
import { useFavorites } from '../../context/FavoritesContext';
import SeriesItem from '../../components/SeriesItem';
import { LoadingView, ErrorView } from '../../components/StatusView';
import COLORS from '../../constants/colors';

export default function SearchScreen() {
  const router = useRouter();
  const { seriesList, loading, error, reload } = useManga();
  const { isFavorite } = useFavorites();
  const [keyword, setKeyword] = useState('');

  // Chỉ lọc lại khi từ khoá hoặc danh sách thay đổi
  const results = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    if (!text) return seriesList;
    return seriesList.filter(
      (s) => s.title.toLowerCase().includes(text) || s.author.toLowerCase().includes(text)
    );
  }, [keyword, seriesList]);

  if (loading && seriesList.length === 0) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={reload} />;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên truyện hoặc tác giả..."
        value={keyword}
        onChangeText={setKeyword}
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SeriesItem
            series={item}
            isFavorite={isFavorite(item.id)}
            onPress={() => router.push({ pathname: '/detail', params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Không tìm thấy truyện nào</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    margin: 12,
    fontSize: 16,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.muted,
    marginTop: 24,
  },
});
