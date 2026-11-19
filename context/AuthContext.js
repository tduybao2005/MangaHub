import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../api/auth';

// B1 — Tạo kênh phát thông tin người đăng nhập
const AuthContext = createContext();

// B2 — Phát sóng giá trị từ gốc ứng dụng
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, email } hoặc null nếu chưa đăng nhập
  const [loading, setLoading] = useState(true); // đang khôi phục phiên đăng nhập khi mở app

  useEffect(() => {
    authApi.getSession().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  // Lỗi (AuthError) được ném ra cho màn hình tự hiển thị
  const login = async (values) => {
    const u = await authApi.login(values);
    setUser(u);
    return u;
  };

  const register = (values) => authApi.register(values);

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// B3 — Màn hình nào cần thì "nghe"
export const useAuth = () => useContext(AuthContext);
