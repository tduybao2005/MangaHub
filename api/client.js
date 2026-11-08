// Axios instance – cấu hình dùng chung cho mọi request
import axios from 'axios';

// Dữ liệu truyện (file data/manga.json) được đặt trên GitHub của project
export const BASE_URL = 'https://raw.githubusercontent.com/tduybao2005/MangaHub/main/data';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 giây
});

export default api;
