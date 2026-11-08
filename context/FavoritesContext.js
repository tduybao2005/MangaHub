import React, { createContext, useContext, useState } from 'react';

// B1 — Tạo kênh phát danh sách truyện yêu thích
const FavoritesContext = createContext();

// B2 — Phát sóng giá trị từ gốc ứng dụng (lưu id các bộ truyện đã thích)
export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState([]);

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
