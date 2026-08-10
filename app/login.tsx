import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  const handleSendOtp = () => {
    if (!phone || phone.length < 9) {
      Alert.alert('تنبيه', 'يرجى إدخال رقم هاتف صحيح');
      return;
    }
    setStep('otp');
  };

  const handleVerifyOtp = async () => {
    if (otp !== '1234') {
      Alert.alert('خطأ', 'رمز التحقق غير صحيح، استعمل الرمز التجريبي: 1234');
      return;
    }

    // حفظ بيانات الجلسة ورقم الهاتف
    await AsyncStorage.setItem('user_phone', phone);
    await AsyncStorage.setItem('is_logged_in', 'true');

    // الانتقال للشاشة الرئيسية
    router.replace('/(tabs)/');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Ionicons name="logo-tiktok" size={80} color="#FF0050" />
          <Text style={styles.appName}>تكتوم</Text>
          <Text style={styles.subtitle}>تسجيل الدخول إلى حسابك</Text>
        </View>

        {step === 'phone' ? (
          <View style={styles.inputCard}>
            <Text style={styles.label}>رقم الهاتف</Text>
            <View style={styles.phoneInputRow}>
              <Text style={styles.countryCode}>+249</Text>
              <TextInput
                style={styles.input}
                placeholder="0918517505"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
              <Text style={styles.buttonText}>إرسال رمز التحقق</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.inputCard}>
            <Text style={styles.label}>أدخل رمز التحقق (OTP)</Text>
            <Text style={styles.hintText}>تم إرسال الرمز التجريبي إلى {phone}</Text>

            <TextInput
              style={[styles.input, styles.otpInput]}
              placeholder="1234"
              placeholderTextColor="#666"
              keyboardType="number-pad"
              maxLength={4}
              value={otp}
              onChangeText={setOtp}
            />

            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
              <Text style={styles.buttonText}>تأكيد والدخول</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => setStep('phone')}>
              <Text style={styles.backButtonText}>تغيير رقم الهاتف</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 25 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  appName: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginTop: 10 },
  subtitle: { color: '#888', fontSize: 14, marginTop: 5 },
  inputCard: { backgroundColor: '#121212', borderRadius: 15, padding: 20 },
  label: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  countryCode: { color: '#FF0050', fontSize: 16, fontWeight: 'bold', marginRight: 10 },
  input: { flex: 1, color: '#FFF', fontSize: 16, height: 50 },
  otpInput: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    paddingHorizontal: 15,
    textAlign: 'center',
    letterSpacing: 8,
    fontSize: 20,
    marginBottom: 20,
  },
  hintText: { color: '#777', fontSize: 12, marginBottom: 15 },
  button: {
    backgroundColor: '#FF0050',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  backButton: { marginTop: 15, alignItems: 'center' },
  backButtonText: { color: '#888', fontSize: 13 },
});
