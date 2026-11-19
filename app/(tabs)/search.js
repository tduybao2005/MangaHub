import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useManga } from '../../context/MangaContext';
import { useFavorites } from '../../context/FavoritesContext';
import SeriesItem from '../../components/SeriesItem';
import GenreChips from '../../components/GenreChips';
import { LoadingView, ErrorView } from '../../components/StatusView';
import { useTheme } from '../../context/ThemeContext';

export default function SearchScreen() {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);
  const router = useRouter();
  const { seriesList, loading, error, reload } = useManga();
  const { isFavorite } = useFavorites();
  const [keyword, setKeyword] = useState('');
  const [genre, setGenre] = useState(''); // '' = tất cả thể loại

  // Danh sách thể loại lấy từ dữ liệu (không trùng, sắp theo A-Z); truyện thiếu `genres` thì coi như rỗng
  const genres = useMemo(() => {
    const set = new Set();
    seriesList.forEach((s) => (s.genres || []).forEach((g) => set.add(g)));
    return [...set].sort((a, b) => a.localeCompare(b, 'vi'));
  }, [seriesList]);

  // Chỉ lọc lại khi từ khoá, thể loại hoặc danh sách thay đổi (lọc theo cả 2 điều kiện)
  const results = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    return seriesList.filter((s) => {
      const matchText = !text || s.title.toLowerCase().includes(text) || s.author.toLowerCase().includes(text);
      const matchGenre = !genre || (s.genres || []).includes(genre);
      return matchText && matchGenre;
    });
  }, [keyword, genre, seriesList]);

  if (loading && seriesList.length === 0) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={reload} />;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên truyện hoặc tác giả..."
        placeholderTextColor={COLORS.muted}
        value={keyword}
        onChangeText={setKeyword}
      />
      <GenreChips genres={genres} selected={genre} onSelect={setGenre} />
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

const makeStyles = (COLORS) => StyleSheet.create({
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
    color: COLORS.text,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.muted,
    marginTop: 24,
  },
});
