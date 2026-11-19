import React, { useEffect, useRef } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useManga } from '../context/MangaContext';
import { useReading } from '../context/ReadingContext';
import { LoadingView, ErrorView } from '../components/StatusView';
import COLORS from '../constants/colors';

// Đầu chương: tên truyện + tên chương
function ReaderHeader({ series, chapter }) {
  return (
    <View style={styles.header}>
      <Text style={styles.seriesTitle}>{series.title}</Text>
      <Text style={styles.chapterTitle}>Chương {chapter.number}: {chapter.title}</Text>
      <Text style={styles.pageCount}>{chapter.pages.length} trang</Text>
    </View>
  );
}

// Cuối chương: nút chuyển chương trước / chương sau
function ReaderFooter({ prevChapter, nextChapter, onOpen }) {
  return (
    <View style={styles.footer}>
      <Text style={styles.endText}>Hết chương</Text>
      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={[styles.navButton, !prevChapter && styles.navButtonDisabled]}
          disabled={!prevChapter}
          onPress={() => onOpen(prevChapter)}
        >
          <Text style={styles.navText}>‹ Chương trước</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, !nextChapter && styles.navButtonDisabled]}
          disabled={!nextChapter}
          onPress={() => onOpen(nextChapter)}
        >
          <Text style={styles.navText}>Chương sau ›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ReaderScreen() {
  const router = useRouter();
  const { seriesId, chapterId, page } = useLocalSearchParams();
  const { getSeries, loading, error, reload } = useManga();
  const { saveProgress, markRead } = useReading();

  const series = getSeries(seriesId);
  const index = series ? series.chapters.findIndex((c) => c.id === chapterId) : -1;
  const chapter = index >= 0 ? series.chapters[index] : null;

  // Trang cần nhảy tới khi mở (từ "Đọc tiếp"); sai hoặc ngoài phạm vi -> đọc từ đầu
  const pageParam = parseInt(page, 10);
  const startPage = chapter && pageParam > 0 && pageParam < chapter.pages.length ? pageParam : 0;

  const listRef = useRef(null);
  const resumed = useRef(false); // đã nhảy tới trang cũ chưa
  const ready = useRef(startPage === 0); // chỉ ghi tiến độ khi đã nhảy xong (tránh ghi đè bằng trang 0)
  const attempts = useRef(0);

  // FlatList không cho đổi onViewableItemsChanged sau khi tạo -> dùng ref giữ giá trị mới nhất
  const latest = useRef({});
  latest.current = {
    seriesId: series ? series.id : null,
    chapterId: chapter ? chapter.id : null,
    total: chapter ? chapter.pages.length : 0,
    saveProgress,
    markRead,
  };

  // Đổi chương -> đặt lại trạng thái nhảy trang
  useEffect(() => {
    resumed.current = false;
    attempts.current = 0;
    ready.current = startPage === 0;
  }, [chapterId, startPage]);

  // Trang nào đang hiện trên màn hình -> lưu lại; thấy trang cuối -> đánh dấu đã đọc
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    const { seriesId: sid, chapterId: cid, total, saveProgress: save, markRead: mark } = latest.current;
    if (!ready.current || !sid || viewableItems.length === 0) return;
    const indexes = viewableItems.map((v) => v.index).filter((i) => i !== null);
    if (indexes.length === 0) return;
    save(sid, cid, Math.min(...indexes));
    if (Math.max(...indexes) === total - 1) mark(sid, cid);
  }).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 30 }).current;

  // Nhảy tới trang đã đọc dở; ảnh có chiều cao khác nhau nên có thể phải thử lại
  const resume = () => {
    if (!listRef.current) return;
    listRef.current.scrollToIndex({ index: startPage, animated: false });
    setTimeout(() => { ready.current = true; }, 400);
  };
  const onScrollToIndexFailed = (info) => {
    attempts.current += 1;
    if (attempts.current > 5) {
      ready.current = true;
      return;
    }
    listRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: false });
    setTimeout(resume, 150);
  };

  if (loading && !chapter) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={reload} />;
  if (!chapter) return <ErrorView message="Không tìm thấy chương" buttonTitle="Quay lại" onRetry={() => router.back()} />;

  const prevChapter = series.chapters[index - 1];
  const nextChapter = series.chapters[index + 1];

  // replace: thay màn hình đọc hiện tại, bấm "quay lại" sẽ về màn chi tiết
  const openChapter = (c) =>
    router.replace({ pathname: '/reader', params: { seriesId: series.id, chapterId: c.id } });

  return (
    <FlatList
      key={chapter.id}
      ref={listRef}
      style={styles.container}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      onLayout={() => {
        if (startPage > 0 && !resumed.current) {
          resumed.current = true;
          resume();
        }
      }}
      onScrollToIndexFailed={onScrollToIndexFailed}
      data={chapter.pages}
      keyExtractor={(item) => item.url}
      ListHeaderComponent={<ReaderHeader series={series} chapter={chapter} />}
      renderItem={({ item }) => (
        <Image
          source={{ uri: item.url }}
          // Mỗi trang có kích thước khác nhau -> giữ đúng tỉ lệ rộng / cao của ảnh
          style={[styles.page, { aspectRatio: item.width / item.height }]}
        />
      )}
      ListFooterComponent={
        <ReaderFooter prevChapter={prevChapter} nextChapter={nextChapter} onOpen={openChapter} />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  seriesTitle: {
    color: COLORS.muted,
    fontSize: 13,
  },
  chapterTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
  pageCount: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 4,
  },
  page: {
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 4,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  endText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  footerButtons: {
    flexDirection: 'row',
  },
  navButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
