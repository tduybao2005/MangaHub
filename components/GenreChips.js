import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

// Hàng nút chọn thể loại. Bấm 1 thể loại để lọc, bấm lại để bỏ chọn.
// genres: ['Hài hước', ...] — rỗng thì không hiện gì; selected: thể loại đang chọn ('' = không chọn)
export default function GenreChips({ genres, selected, onSelect }) {
  if (genres.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      {genres.map((g) => {
        const active = g === selected;
        return (
          <TouchableOpacity
            key={g}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(active ? '' : g)}
          >
            <Text style={[styles.text, active && styles.textActive]}>{g}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    // Chiều cao cố định, không co lại (nếu không danh sách bên dưới sẽ ép hàng nút bị cắt)
    flexGrow: 0,
    flexShrink: 0,
    height: 48,
  },
  content: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
  },
  text: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  textActive: {
    color: '#fff',
  },
});
