import React, { useRef, useState, useMemo } from 'react';
import { Text, ScrollView, TouchableOpacity, ActivityIndicator, Animated, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import FeedbackModal from '../components/FeedbackModal';
import { validateRegister } from '../utils/validators';
import { useTheme } from '../context/ThemeContext';

export default function RegisterScreen() {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState(null); // { type, title, message, onConfirm }

  // Hiệu ứng rung form khi nhập sai
  const shake = useRef(new Animated.Value(0)).current;
  const runShake = () =>
    Animated.sequence([10, -10, 8, -8, 4, 0].map((toValue) =>
      Animated.timing(shake, { toValue, duration: 50, useNativeDriver: true })
    )).start();

  const handleSubmit = async () => {
    const found = validateRegister({ name, email, password, confirm });
    setErrors(found);
    if (Object.keys(found).length > 0) {
      runShake();
      return;
    }

    setSubmitting(true);
    try {
      await register({ name, email, password });
      // Đăng ký xong -> sang màn đăng nhập, email điền sẵn
      setModal({
        type: 'success',
        title: 'Đăng ký thành công 🎉',
        message: 'Tài khoản đã được tạo. Hãy đăng nhập để tiếp tục.',
        confirmText: 'Đăng nhập',
        onConfirm: () => {
          setModal(null);
          router.replace({ pathname: '/login', params: { email: email.trim() } });
        },
      });
    } catch (e) {
      runShake();
      if (e.code === 'EMAIL_TAKEN') setErrors({ email: e.message });
      setModal({
        type: 'error',
        title: 'Không thể đăng ký',
        message: e.code === 'EMAIL_TAKEN' ? 'Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.' : e.message,
        onConfirm: () => setModal(null),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Ionicons name="person-add" size={72} color={COLORS.primary} style={styles.logo} />
      <Text style={styles.title}>Tạo tài khoản</Text>

      <Animated.View style={{ transform: [{ translateX: shake }] }}>
        <FormField label="Tên hiển thị" placeholder="Tên của bạn" autoCapitalize="words" value={name} onChangeText={setName} error={errors.name} />
        <FormField label="Email" placeholder="ban@example.com" keyboardType="email-address" value={email} onChangeText={setEmail} error={errors.email} />
        <FormField label="Mật khẩu" placeholder="Ít nhất 6 ký tự" secureTextEntry value={password} onChangeText={setPassword} error={errors.password} />
        <FormField label="Nhập lại mật khẩu" placeholder="Nhập lại mật khẩu" secureTextEntry value={confirm} onChangeText={setConfirm} error={errors.confirm} />
      </Animated.View>

      <TouchableOpacity style={[styles.button, submitting && styles.buttonDisabled]} onPress={handleSubmit} disabled={submitting}>
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Đăng ký</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => router.replace('/login')}>
        <Text style={styles.linkText}>Đã có tài khoản? <Text style={styles.linkBold}>Đăng nhập</Text></Text>
      </TouchableOpacity>

      <FeedbackModal visible={!!modal} {...(modal || {})} />
    </ScrollView>
  );
}

const makeStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 24,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  logo: {
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginVertical: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    color: COLORS.muted,
  },
  linkBold: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
