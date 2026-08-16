import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function VideoCallScreen() {
  const router = useRouter();
  const [facing, setFacing] = useState('front');
  const [isMuted, setIsMuted] = useState(false);

  return (
    <View style={styles.container}>
      {/* الكاميرا الحية للمستخدم */}
      <CameraView style={styles.camera} facing={facing as any}>
        <View style={styles.overlay}>
          <Text style={styles.callTitle}>مكالمة فيديو Tiktom</Text>

          {/* أزرار التحكم بالمكالمة */}
          <View style={styles.controls}>
            {/* زر كتم الصوت */}
            <TouchableOpacity style={styles.btn} onPress={() => setIsMuted(!isMuted)}>
              <Ionicons name={isMuted ? "mic-off" : "mic"} size={28} color="white" />
            </TouchableOpacity>

            {/* زر إنهاء المكالمة */}
            <TouchableOpacity style={[styles.btn, styles.endCallBtn]} onPress={() => router.back()}>
              <Ionicons name="call" size={30} color="white" />
            </TouchableOpacity>

            {/* زر قلب الكاميرا */}
            <TouchableOpacity style={styles.btn} onPress={() => setFacing(current => current === 'back' ? 'front' : 'back')}>
              <Ionicons name="camera-reverse" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'space-between', paddingVertical: 60, alignItems: 'center' },
  callTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  btn: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  endCallBtn: { backgroundColor: '#FF3B30', transform: [{ rotate: '135deg' }] }
});
