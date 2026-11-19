// Bảng màu cho 2 giao diện. Màu chủ đạo (primary) giữ nguyên ở cả hai.
export const LIGHT = {
  primary: '#E8590C',
  background: '#F7F7F7',
  card: '#FFFFFF',
  text: '#222222',
  muted: '#777777',
  border: '#E5E5E5',
  success: '#2E7D32',
  danger: '#D32F2F',
  highlight: '#FFF0E6', // nền nhẹ cho nút được chọn
};

export const DARK = {
  primary: '#F26A1B',
  background: '#121212',
  card: '#1E1E1E',
  text: '#EDEDED',
  muted: '#A0A0A0',
  border: '#333333',
  success: '#43A047',
  danger: '#E53935',
  highlight: '#3A2316',
};

// Mặc định = giao diện sáng (màn đọc truyện luôn nền tối nên dùng trực tiếp bảng này)
const COLORS = LIGHT;
export default COLORS;
