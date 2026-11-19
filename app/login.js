import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Animated, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import FeedbackModal from '../components/FeedbackModal';
import { validateLogin } from '../utils/validators';
import COLORS from '../constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { email: presetEmail } = useLocalSearchParams(); // email điền sẵn sau khi đăng ký xong
  const { login } = useAuth();

  const [email, setEmail] = useState(presetEmail || '');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState(null); // { type, title, message, onConfirm }

  // Hiệu ứng rung form khi đăng nhập sai
  const shake = useRef(new Animated.Value(0)).current;
  const runShake = () =>
    Animated.sequence([10, -10, 8, -8, 4, 0].map((toValue) =>
      Animated.timing(shake, { toValue, duration: 50, useNativeDriver: true })
    )).start();

  const closeModal = () => setModal(null);

  const goBackOrAccount = () => (router.canGoBack() ? router.back() : router.replace('/account'));

  const handleSubmit = async () => {
    const found = validateLogin({ email, password });
    setErrors(found);
    if (Object.keys(found).length > 0) {
      runShake();
      return;
    }

    setSubmitting(true);
    try {
      const user = await login({ email, password });
      setModal({
        type: 'success',
        title: 'Đăng nhập thành công',
        message: `Chào mừng trở lại, ${user.name}!`,
        onConfirm: () => {
          closeModal();
          goBackOrAccount();
        },
      });
    } catch (e) {
      runShake();
      setModal({
        type: 'error',
        title: e.code === 'NO_ACCOUNT' ? 'Tài khoản chưa tồn tại' : 'Đăng nhập thất bại',
        message:
          e.code === 'NO_ACCOUNT'
            ? 'Email này chưa được đăng ký. Hãy tạo tài khoản mới nhé.'
            : 'Sai email hoặc mật khẩu. Vui lòng kiểm tra lại.',
        confirmText: 'Thử lại',
        onConfirm: closeModal,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Ionicons name="person-circle" size={90} color={COLORS.primary} style={styles.logo} />
      <Text style={styles.title}>Đăng nhập</Text>

      <Animated.View style={{ transform: [{ translateX: shake }] }}>
        <FormField
          label="Email"
          placeholder="ban@example.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <FormField
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />
      </Animated.View>

      <TouchableOpacity style={[styles.button, submitting && styles.buttonDisabled]} onPress={handleSubmit} disabled={submitting}>
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Đăng nhập</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => router.replace('/register')}>
        <Text style={styles.linkText}>Chưa có tài khoản? <Text style={styles.linkBold}>Đăng ký</Text></Text>
      </TouchableOpacity>

      <FeedbackModal visible={!!modal} {...(modal || {})} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 20,
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
