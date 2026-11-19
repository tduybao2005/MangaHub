// Gọi "API" bảng xếp hạng (data/rankings.json trên GitHub) rồi ghép với danh sách truyện qua id
import { useFetch } from './useFetch';
import { useManga } from '../context/MangaContext';

const RANKINGS_URL = '/rankings.json';

// period: 'week' | 'month' | 'all'
// Trả về items = [{ rank, views, rating, series }] — bỏ qua truyện không còn trong manga.json
export function useRankings(period) {
  const { data, loading, error, reload } = useFetch(RANKINGS_URL);
  const { getSeries } = useManga();

  const list = data && data.rankings && Array.isArray(data.rankings[period]) ? data.rankings[period] : [];
  const items = list
    .map((r) => ({ ...r, series: getSeries(r.seriesId) }))
    .filter((r) => r.series);

  return { items, loading, error, reload };
}
