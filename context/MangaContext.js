import React, { createContext, useContext } from 'react';
import { useFetch } from '../hooks/useFetch';

// API trả về: { series: [ { id, title, author, ..., chapters: [ { id, number, title, pages: [...] } ] } ] }
const MANGA_URL = '/manga.json';

// B1 — Tạo kênh phát danh sách bộ truyện (gọi API 1 lần, mọi màn hình dùng chung)
const MangaContext = createContext();

// B2 — Phát sóng giá trị từ gốc ứng dụng
export function MangaProvider({ children }) {
  const { data, loading, error, reload } = useFetch(MANGA_URL);

  const seriesList = data ? data.series : [];

  const getSeries = (id) => seriesList.find((s) => s.id === id);

  return (
    <MangaContext.Provider value={{ seriesList, loading, error, reload, getSeries }}>
      {children}
    </MangaContext.Provider>
  );
}

// B3 — Màn hình nào cần thì "nghe"
export const useManga = () => useContext(MangaContext);
