import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

// Mục "Đang đọc dở" ở trang chủ: danh sách ngang các truyện đã đọc dở
// items: [{ series, chapter, page }] — rỗng thì không hiện gì
export default function ContinueReading({ items, onPress }) {
  if (items.length === 0) return null;

  return (
    <View>
      <Text style={styles.title}>Đang đọc dở</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={items}
        keyExtractor={(item) => item.series.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
            <Image source={{ uri: item.series.cover }} style={styles.cover} />
            <Text style={styles.name} numberOfLines={1}>{item.series.title}</Text>
            <Text style={styles.chapter}>Chương {item.chapter.number}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 6,
  },
  list: {
    paddingHorizontal: 8,
  },
  card: {
    width: 110,
    marginHorizontal: 4,
  },
  cover: {
    width: 110,
    height: 150,
    borderRadius: 8,
    backgroundColor: COLORS.border,
  },
  name: {
    color: COLORS.text,
    fontWeight: 'bold',
    marginTop: 6,
  },
  chapter: {
    color: COLORS.primary,
    fontSize: 12,
    marginTop: 2,
  },
});
