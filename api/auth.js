// "Server" giả lập cho đăng nhập / đăng ký.
// Mọi hàm đều trả về Promise, có độ trễ và ném lỗi có mã (code) giống một API thật.
// Dữ liệu lưu trong bộ nhớ máy (AsyncStorage) thay cho database:
//   users   -> [{ name, email, salt, passwordHash }]
//   session -> { email } (người đang đăng nhập)
// Khi có server thật, chỉ cần đổi nội dung các hàm này thành axios.post(...) — màn hình không phải sửa.
import * as Crypto from 'expo-crypto';
import { loadJSON, saveJSON } from '../utils/storage';

const USERS_KEY = 'users';
const SESSION_KEY = 'session';
const FAKE_LATENCY = 600; // mô phỏng thời gian gọi mạng (ms)

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Lỗi kèm mã: EMAIL_TAKEN | NO_ACCOUNT | INVALID_CREDENTIALS
export class AuthError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

const normalizeEmail = (email) => email.trim().toLowerCase();

// Không lưu mật khẩu thô: băm SHA-256 kèm salt (chuỗi ngẫu nhiên riêng cho từng người)
const hashPassword = (password, salt) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, salt + password);

const loadUsers = async () => {
  const users = await loadJSON(USERS_KEY, []);
  return Array.isArray(users) ? users : [];
};

// Chỉ trả về thông tin công khai, không bao giờ trả mật khẩu / salt
const toPublicUser = (u) => ({ name: u.name, email: u.email });

export async function register({ name, email, password }) {
  await delay(FAKE_LATENCY);
  const users = await loadUsers();
  const key = normalizeEmail(email);
  if (users.some((u) => u.email === key)) {
    throw new AuthError('EMAIL_TAKEN', 'Email này đã được đăng ký');
  }
  const salt = Crypto.randomUUID();
  const user = { name: name.trim(), email: key, salt, passwordHash: await hashPassword(password, salt) };
  await saveJSON(USERS_KEY, [...users, user]);
  return toPublicUser(user);
}

export async function login({ email, password }) {
  await delay(FAKE_LATENCY);
  const users = await loadUsers();
  const user = users.find((u) => u.email === normalizeEmail(email));
  if (!user) throw new AuthError('NO_ACCOUNT', 'Tài khoản chưa tồn tại');
  if ((await hashPassword(password, user.salt)) !== user.passwordHash) {
    throw new AuthError('INVALID_CREDENTIALS', 'Sai email hoặc mật khẩu');
  }
  await saveJSON(SESSION_KEY, { email: user.email });
  return toPublicUser(user);
}

export async function logout() {
  await saveJSON(SESSION_KEY, null);
}

// Khôi phục người đang đăng nhập khi mở app (null nếu chưa đăng nhập)
export async function getSession() {
  const session = await loadJSON(SESSION_KEY, null);
  if (!session || typeof session.email !== 'string') return null;
  const users = await loadUsers();
  const user = users.find((u) => u.email === session.email);
  return user ? toPublicUser(user) : null;
}
