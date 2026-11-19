import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadJSON, saveJSON } from '../utils/storage';

// B1 — Tạo kênh phát danh sách truyện yêu thích
const FavoritesContext = createContext();

// B2 — Phát sóng giá trị từ gốc ứng dụng (lưu id các bộ truyện đã thích)
export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState([]);
  // Đã đọc xong dữ liệu từ máy chưa? (tránh ghi đè dữ liệu cũ bằng mảng rỗng ban đầu)
  const [loaded, setLoaded] = useState(false);

  // Mở app: đọc danh sách yêu thích đã lưu
  useEffect(() => {
    loadJSON('favorites', []).then((saved) => {
      setFavoriteIds(Array.isArray(saved) ? saved : []);
      setLoaded(true);
    });
  }, []);

  // Mỗi khi danh sách đổi (và đã đọc xong): ghi lại vào máy
  useEffect(() => {
    if (loaded) saveJSON('favorites', favoriteIds);
  }, [favoriteIds, loaded]);

  const isFavorite = (id) => favoriteIds.includes(id);

  const toggleFavorite = (id) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// B3 — Màn hình nào cần thì "nghe"
export const useFavorites = () => useContext(FavoritesContext);
