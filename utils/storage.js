import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage chỉ lưu chuỗi -> phải JSON.stringify khi lưu và JSON.parse khi đọc.
// Các hàm này đều là async (trả về Promise) nên khi gọi phải dùng await.

// Đọc 1 giá trị theo key. Thiếu key, lỗi đọc hoặc JSON hỏng -> trả về fallback
export async function loadJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

// Ghi 1 giá trị theo key. Lỗi ghi chỉ log, không làm app sập
export async function saveJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Không lưu được', key, e);
  }
}
