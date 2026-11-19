import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useReading } from '../../context/ReadingContext';
import { LoadingView } from '../../components/StatusView';
import FeedbackModal from '../../components/FeedbackModal';
import COLORS from '../../constants/colors';

// Chữ cái đầu của tên làm avatar: "Bảo Trần" -> "BT"
function getInitials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
}

// 1 ô thống kê (số + nhãn)
function Stat({ icon, value, label }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={22} color={COLORS.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function AccountScreen() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { favoriteIds } = useFavorites();
  const { readChapters } = useReading();
  const [confirmLogout, setConfirmLogout] = useState(false);

  if (loading) return <LoadingView />;

  // Chưa đăng nhập
  if (!user) {
    return (
      <View style={styles.container}>
        <Ionicons name="person-circle-outline" size={110} color={COLORS.muted} />
        <Text style={styles.welcome}>Chào mừng bạn đến MangaHub!</Text>
        <Text style={styles.sub}>Đăng nhập để có trải nghiệm đọc truyện của riêng bạn.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/login')}>
          <Text style={styles.primaryText}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} onPress={() => router.push('/register')}>
          <Text style={styles.outlineText}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Đã đăng nhập
  const readCount = Object.values(readChapters).reduce(
    (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
      </View>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.stats}>
        <Stat icon="heart" value={favoriteIds.length} label="Truyện yêu thích" />
        <Stat icon="checkmark-circle" value={readCount} label="Chương đã đọc" />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => setConfirmLogout(true)}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>

      <FeedbackModal
        visible={confirmLogout}
        type="confirm"
        title="Đăng xuất?"
        message="Bạn sẽ cần đăng nhập lại để dùng tài khoản này."
        confirmText="Đăng xuất"
        cancelText="Ở lại"
        onCancel={() => setConfirmLogout(false)}
        onConfirm={() => {
          setConfirmLogout(false);
          logout();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 8,
    textAlign: 'center',
  },
  sub: {
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  primaryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    marginTop: 12,
  },
  outlineText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 12,
  },
  email: {
    color: COLORS.muted,
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    width: '100%',
    maxWidth: 320,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 4,
  },
  statLabel: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    padding: 12,
  },
  logoutText: {
    color: COLORS.danger,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});
