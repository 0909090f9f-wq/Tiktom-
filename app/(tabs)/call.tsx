import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default function VideoCallScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [facing, setFacing] = useState<'front' | 'back'>('front');

  if (!permission) return <View style={styles.container} />;
  
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff', marginBottom: 20 }}>تطبيق تكتوم يحتاج إذن استخدام الكاميرا</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>منح الإذن</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 1️⃣ الدوائر المتقاربة أعلى الشاشة للمكالمة */}
      <View style={styles.callOverlay}>
        <View style={styles.circlesContainer}>
          {/* الدائرة الأولى: كاميرتك الحالية */}
          <View style={[styles.avatarCircle, styles.myCircle]}>
            {isCameraOn ? (
              <CameraView style={styles.miniCamera} facing={facing} />
            ) : (
              <View style={styles.offPlaceholder}>
                <Ionicons name="person" size={24} color="#777" />
              </View>
            )}
          </View>

          {/* الدائرة الثانية: الطرف الآخر (صورة تجريبية) */}
          <View style={[styles.avatarCircle, styles.peerCircle]}>
            <Image 
              source={{ uri: 'https://picsum.photos/200' }} 
              style={styles.peerImage} 
            />
          </View>
        </View>

        <Text style={styles.callStatus}>مكالمة تكتوم الحصرية 📞</Text>
      </View>

      {/* 2️⃣ عرض الكاميرا الرئيسية والشاشة */}
      {isCameraOn ? (
        <CameraView style={styles.camera} facing={facing}>
          {/* أزرار التحكم بالشرائح على الكاميرا */}
          <View style={styles.controlsContainer}>
            {/* زر إغلاق / فتح الكاميرا */}
            <TouchableOpacity style={styles.iconBtn} onPress={() => setIsCameraOn(!isCameraOn)}>
              <Ionicons name={isCameraOn ? "videocam" : "videocam-off"} size={22} color="#fff" />
            </TouchableOpacity>

            {/* زر قلب الكاميرا */}
            <TouchableOpacity style={styles.iconBtn} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
              <Ionicons name="camera-reverse" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View style={styles.cameraOffView}>
          <Ionicons name="videocam-off" size={60} color="#444" />
          <Text style={{ color: '#aaa', marginTop: 10 }}>الكاميرا مغلقة</Text>
          <TouchableOpacity style={[styles.btn, { marginTop: 20 }]} onPress={() => setIsCameraOn(true)}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>تشغيل الكاميرا</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  camera: { flex: 1 },
  
  // شريط الدوائر المتقاربة العلوي
  callOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 999,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 30,
  },
  circlesContainer: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: '#222',
  },
  myCircle: { borderColor: '#00f2fe', zIndex: 2 },
  peerCircle: { borderColor: '#ff0050', marginLeft: -18, zIndex: 1 },
  miniCamera: { width: '100%', height: '100%' },
  peerImage: { width: '100%', height: '100%' },
  offPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  callStatus: { color: '#fff', fontWeight: 'bold', fontSize: 13, marginRight: 10 },

  // التحكم بالكاميرا
  controlsContainer: { position: 'absolute', bottom: 40, right: 20, gap: 12 },
  iconBtn: { backgroundColor: 'rgba(0,0,0,0.6)', padding: 12, borderRadius: 25 },
  cameraOffView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btn: { backgroundColor: '#ff0050', paddingVertical: 12, paddingHorizontal: 22, borderRadius: 25 },
});
