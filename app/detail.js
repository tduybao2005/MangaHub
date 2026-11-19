import React, { useMemo } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useManga } from '../context/MangaContext';
import { useFavorites } from '../context/FavoritesContext';
import { useReading } from '../context/ReadingContext';
import { LoadingView, ErrorView } from '../components/StatusView';
import { useTheme } from '../context/ThemeContext';

// 1 dòng thông tin dạng "Nhãn: giá trị"
function InfoRow({ label, value }) {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function DetailScreen() {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getSeries, loading, error, reload } = useManga();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getProgress, isRead } = useReading();

  const series = getSeries(id);

  if (loading && !series) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={reload} />;
  if (!series) return <ErrorView message="Không tìm thấy truyện" buttonTitle="Quay lại" onRetry={() => router.back()} />;

  const liked = isFavorite(series.id);

  // Mở 1 chương (page > 0: nhảy tới trang đang đọc dở)
  const openChapter = (chapter, page = 0) =>
    router.push({ pathname: '/reader', params: { seriesId: series.id, chapterId: chapter.id, page } });

  // Đã đọc dở chương nào chưa? (bỏ qua nếu chương đó không còn trong dữ liệu)
  const saved = getProgress(series.id);
  const resumeChapter = saved ? series.chapters.find((c) => c.id === saved.chapterId) : null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.top}>
        <Image source={{ uri: series.cover }} style={styles.cover} />
        <View style={styles.topInfo}>
          <Text style={styles.title}>{series.title}</Text>
          <Text style={styles.author}>{series.author}</Text>
          <Text style={styles.meta}>{series.chapters.length} chương</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.readButton]}
          onPress={() =>
            resumeChapter ? openChapter(resumeChapter, saved.page) : openChapter(series.chapters[0])
          }
        >
          <Ionicons name="book" size={18} color="#fff" />
          <Text style={styles.readText}>
            {resumeChapter ? `Đọc tiếp Chương ${resumeChapter.number}` : 'Đọc từ đầu'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.likeButton, liked && styles.likeButtonActive]}
          onPress={() => toggleFavorite(series.id)}
        >
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={18} color={COLORS.primary} />
          <Text style={styles.likeText}>{liked ? 'Đã thích' : 'Yêu thích'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.description}>{series.description}</Text>
        {series.genres && series.genres.length > 0 && (
          <InfoRow label="Thể loại" value={series.genres.join(', ')} />
        )}
        <InfoRow label="Năm" value={series.year} />
        <InfoRow label="Ngôn ngữ" value={series.language} />
        <InfoRow label="Giấy phép" value={series.license} />
        <InfoRow label="Nguồn" value={series.source} />
      </View>

      <Text style={styles.sectionTitle}>Danh sách chương</Text>
      <View style={styles.card}>
        {/* Danh sách ngắn (dưới 10 chương) nên dùng .map() */}
        {series.chapters.map((chapter) => {
          const read = isRead(series.id, chapter.id);
          return (
            <TouchableOpacity
              key={chapter.id}
              style={[styles.chapterRow, read && styles.chapterRead]}
              onPress={() => openChapter(chapter)}
            >
              <Text style={styles.chapterNumber}>Chương {chapter.number}</Text>
              <Text style={styles.chapterTitle} numberOfLines={1}>{chapter.title}</Text>
              {read ? (
                <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
              ) : (
                <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const makeStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  top: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.card,
  },
  cover: {
    width: 110,
    height: 150,
    borderRadius: 8,
    backgroundColor: COLORS.border,
  },
  topInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  author: {
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 6,
  },
  meta: {
    color: COLORS.muted,
    marginTop: 6,
  },
  buttons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  readButton: {
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  readText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  likeButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginLeft: 8,
  },
  likeButtonActive: {
    backgroundColor: COLORS.highlight,
  },
  likeText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  description: {
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  infoLabel: {
    width: 90,
    color: COLORS.muted,
  },
  infoValue: {
    flex: 1,
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginHorizontal: 16,
    marginTop: 20,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  // Chương đã đọc: làm mờ
  chapterRead: {
    opacity: 0.5,
  },
  chapterNumber: {
    width: 90,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  chapterTitle: {
    flex: 1,
    color: COLORS.text,
  },
});
