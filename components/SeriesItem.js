import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

// 1 dòng trong danh sách truyện: ảnh bìa bên trái, thông tin bên phải
export default function SeriesItem({ series, isFavorite, onPress }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Image source={{ uri: series.cover }} style={styles.cover} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{series.title}</Text>
        <Text style={styles.author}>{series.author} · {series.year}</Text>
        <Text style={styles.meta}>
          {series.chapters.length} chương · {series.language}
        </Text>
      </View>
      {isFavorite && <Ionicons name="heart" size={20} color={COLORS.primary} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  cover: {
    width: 80,
    height: 110,
    borderRadius: 6,
    backgroundColor: COLORS.border,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: 'bold',
  },
  author: {
    color: COLORS.primary,
    fontSize: 13,
    marginTop: 4,
  },
  meta: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 6,
  },
});
