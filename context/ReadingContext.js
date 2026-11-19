import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadJSON, saveJSON } from '../utils/storage';

// progress:     { [seriesId]: { chapterId, page, updatedAt } }  -> đang đọc dở chương nào, trang nào
// readChapters: { [seriesId]: [chapterId, ...] }                -> các chương đã đọc xong

// B1 — Tạo kênh phát tiến độ đọc
const ReadingContext = createContext();

// B2 — Phát sóng giá trị từ gốc ứng dụng
export function ReadingProvider({ children }) {
  const [progress, setProgress] = useState({});
  const [readChapters, setReadChapters] = useState({});
  const [loaded, setLoaded] = useState(false);

  // Mở app: đọc dữ liệu đã lưu
  useEffect(() => {
    Promise.all([loadJSON('progress', {}), loadJSON('readChapters', {})]).then(([p, r]) => {
      setProgress(p && typeof p === 'object' && !Array.isArray(p) ? p : {});
      setReadChapters(r && typeof r === 'object' && !Array.isArray(r) ? r : {});
      setLoaded(true);
    });
  }, []);

  // Dữ liệu đổi (và đã đọc xong) -> ghi lại vào máy
  useEffect(() => {
    if (loaded) saveJSON('progress', progress);
  }, [progress, loaded]);
  useEffect(() => {
    if (loaded) saveJSON('readChapters', readChapters);
  }, [readChapters, loaded]);

  const getProgress = (seriesId) => progress[seriesId];

  const saveProgress = (seriesId, chapterId, page) => {
    setProgress((prev) => ({
      ...prev,
      [seriesId]: { chapterId, page, updatedAt: Date.now() },
    }));
  };

  const isRead = (seriesId, chapterId) =>
    Array.isArray(readChapters[seriesId]) && readChapters[seriesId].includes(chapterId);

  const markRead = (seriesId, chapterId) => {
    setReadChapters((prev) => {
      const list = Array.isArray(prev[seriesId]) ? prev[seriesId] : [];
      if (list.includes(chapterId)) return prev;
      return { ...prev, [seriesId]: [...list, chapterId] };
    });
  };

  return (
    <ReadingContext.Provider value={{ progress, readChapters, getProgress, saveProgress, isRead, markRead }}>
      {children}
    </ReadingContext.Provider>
  );
}

// B3 — Màn hình nào cần thì "nghe"
export const useReading = () => useContext(ReadingContext);
