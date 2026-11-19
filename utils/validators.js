// Kiểm tra dữ liệu form. Trả về object lỗi theo từng ô: { email: '...', password: '...' } (rỗng = hợp lệ)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = 'Vui lòng nhập email';
  else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Email không đúng định dạng';
  if (!password) errors.password = 'Vui lòng nhập mật khẩu';
  return errors;
}

export function validateRegister({ name, email, password, confirm }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Vui lòng nhập tên hiển thị';
  if (!email.trim()) errors.email = 'Vui lòng nhập email';
  else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Email không đúng định dạng';
  if (!password) errors.password = 'Vui lòng nhập mật khẩu';
  else if (password.length < 6) errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  if (!confirm) errors.confirm = 'Vui lòng nhập lại mật khẩu';
  else if (confirm !== password) errors.confirm = 'Mật khẩu nhập lại không khớp';
  return errors;
}
