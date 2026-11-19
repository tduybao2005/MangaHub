import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

// Cửa sổ thông báo có hiệu ứng nảy lên.
// type: 'success' (xanh) | 'error' (đỏ) | 'confirm' (hỏi xác nhận)
// Có cancelText thì hiện thêm nút thứ hai (gọi onCancel)
const ICONS = {
  success: { name: 'checkmark-circle', color: COLORS.success },
  error: { name: 'close-circle', color: COLORS.danger },
  confirm: { name: 'help-circle', color: COLORS.primary },
};

export default function FeedbackModal({
  visible, type = 'success', title, message, confirmText = 'OK', cancelText, onConfirm, onCancel,
}) {
  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Mỗi lần hiện ra: phóng to từ 0.7 -> 1 và mờ dần -> rõ
  useEffect(() => {
    if (!visible) return;
    scale.setValue(0.7);
    opacity.setValue(0);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [visible, scale, opacity]);

  const icon = ICONS[type];

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onCancel || onConfirm}>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.box, { opacity, transform: [{ scale }] }]}>
          <Ionicons name={icon.name} size={64} color={icon.color} />
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.buttons}>
            {cancelText ? (
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={[styles.button, { backgroundColor: icon.color }]} onPress={onConfirm}>
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  box: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 12,
    textAlign: 'center',
  },
  message: {
    color: COLORS.muted,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: COLORS.border,
  },
  cancelText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
