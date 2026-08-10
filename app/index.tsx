import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function IndexScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem('is_logged_in');
        const userPhone = await AsyncStorage.getItem('user_phone');

        if (isLoggedIn === 'true' && userPhone) {
          // تم تسجيل الدخول مسبقاً -> توجيه للرئيسية
          router.replace('/(tabs)/');
        } else {
          // لم يتم تسجيل الدخول -> توجيه لشاشة الدخول
          router.replace('/login');
        }
      } catch (error) {
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF0050" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
