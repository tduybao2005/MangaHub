// Custom hook: Loading – Data – Error
import { useState, useEffect } from 'react';
import api from '../api/client';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Mỗi lần tăng reloadKey thì useEffect chạy lại -> gọi API lại
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.get(url)
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    // Cleanup: bỏ qua kết quả nếu màn hình đã đóng
    return () => { cancelled = true; };
  }, [url, reloadKey]);

  const reload = () => setReloadKey((prev) => prev + 1);

  return { data, loading, error, reload };
}
