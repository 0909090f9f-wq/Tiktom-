import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CallHeader() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.circleButton} onPress={() => router.push('/call')}>
        <Ionicons name="videocam" size={22} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.circleButton} onPress={() => router.push('/call')}>
        <Ionicons name="call" size={22} color="#25D366" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', position: 'absolute', top: 50, right: 15, zIndex: 10 },
  circleButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', marginLeft: 8 }
});
