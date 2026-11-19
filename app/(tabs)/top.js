import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRankings } from '../../hooks/useRankings';
import { LoadingView, ErrorView } from '../../components/StatusView';
import COLORS from '../../constants/colors';

const PERIODS = [
  { key: 'week', label: 'Tuần' },
  { key: 'month', label: 'Tháng' },
  { key: 'all', label: 'Tất cả' },
];

// Màu huy chương cho hạng 1, 2, 3
const MEDAL_COLORS = { 1: '#F4B400', 2: '#9AA0A6', 3: '#CD7F32' };

// 12400 -> "12.4K", 412000 -> "412K"
function formatViews(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 100000 ? 0 : 1).replace(/\.0$/, '')}K`;
  return String(n);
}

export default function TopScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState('week');
  const { items, loading, error, reload } = useRankings(period);

  if (loading && items.length === 0) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={reload} />;

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {PERIODS.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[styles.tab, period === p.key && styles.tabActive]}
            onPress={() => setPeriod(p.key)}
          >
            <Text style={[styles.tabText, period === p.key && styles.tabTextActive]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.series.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push({ pathname: '/detail', params: { id: item.series.id } })}
          >
            <View style={styles.rankBox}>
              {item.rank <= 3 ? (
                <Ionicons name="medal" size={28} color={MEDAL_COLORS[item.rank]} />
              ) : (
                <Text style={styles.rankText}>{item.rank}</Text>
              )}
            </View>
            <Image source={{ uri: item.series.cover }} style={styles.cover} />
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={2}>{item.series.title}</Text>
              <Text style={styles.author}>{item.series.author}</Text>
              <Text style={styles.meta}>
                {formatViews(item.views)} lượt đọc · ★ {item.rating.toFixed(1)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có dữ liệu xếp hạng</Text>}
        // Kéo xuống để tải lại
        refreshing={loading}
        onRefresh={reload}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabs: {
    flexDirection: 'row',
    margin: 12,
    backgroundColor: COLORS.border,
    borderRadius: 8,
    padding: 3,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.muted,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 10,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  rankBox: {
    width: 36,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.muted,
  },
  cover: {
    width: 60,
    height: 82,
    borderRadius: 6,
    backgroundColor: COLORS.border,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  author: {
    color: COLORS.primary,
    fontSize: 12,
    marginTop: 2,
  },
  meta: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 6,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.muted,
    marginTop: 24,
  },
});
